const path = require("path");
const process = require("process");
const { google } = require("googleapis");
const db = require("../model");
const { Catalog, CatalogHierarchy } = db;
const { Op } = require("sequelize");
const addNodeToClousreTable = require("./add-node");
// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

async function createIfNotFind(
  class_code,
  subject_code,
  parent_id,
  order,
  name
) {
  const findRecord = await Catalog.findOne({
    attributes: ["id"],
    where: {
      [Op.and]: [
        { parent_id: { [Op.eq]: parent_id } },
        { order: { [Op.eq]: order } },
        { for_class: { [Op.eq]: class_code } },
      ],
    },
  });

  if (!findRecord) {
    let root_path;
    if (parent_id) {
      const findParent = await Catalog.findOne({
        attributes: ["root_path", "name", "is_leaf"],
        where: {
          id: { [Op.eq]: parent_id },
        },
      });
      root_path = findParent.root_path;
      root_path.push({ id: parent_id, name: findParent.name });
      if (findParent.is_leaf) {
        await Catalog.update(
          { is_leaf: false },
          { where: { id: { [Op.eq]: parent_id } } }
        );
      }
    } else {
      root_path = [];
    }
    const newRecord = await Catalog.create({
      name,
      parent_id,
      order,
      for_class: class_code,
      subject_code,
      root_path,
    });
    await CatalogHierarchy.create({
      parent_id: newRecord.id,
      child_id: newRecord.id,
      depth: 0,
    });
    if (parent_id) await addNodeToClousreTable(parent_id, newRecord.id);
    return newRecord.id;
  }
  return findRecord.id;
}

(async () => {
  const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: SCOPES,
  });

  const authClient = await auth.getClient();
  const googleSheetsInstance = google.sheets({
    version: "v4",
    auth: authClient,
  });

  const spreadsheetId = "1L8ZqcpbLZ0kU7Pp40tPU5jkbkIbctkKrTjA2_YicqHM";

  try {
    const result = await googleSheetsInstance.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: ["Lớp 7 - MỚI!B2:L"],
    });
    const rows = result.data.values;

    for await (const row of rows) {
      console.log("---------------------------------");
      const [
        class_code,
        subject_code,
        subject_name,
        chapter_code,
        chapter_name,
        unit_code,
        unit_name,
        dang_code,
        dang_name,
        dang_chi_tiet_code,
        dang_chi_tiet_name,
      ] = row;
      if (class_code && subject_code && subject_name) {
        const subject_id = await createIfNotFind(
          class_code,
          subject_code,
          0,
          subject_code,
          subject_name
        );
        if (chapter_code && chapter_name) {
          const chapter_id = await createIfNotFind(
            class_code,
            subject_code,
            subject_id,
            chapter_code,
            chapter_name
          );
          if (unit_code && unit_name) {
            const unit_id = await createIfNotFind(
              class_code,
              subject_code,
              chapter_id,
              unit_code,
              unit_name
            );
            if (dang_code && dang_name) {
              const dang_id = await createIfNotFind(
                class_code,
                subject_code,
                unit_id,
                dang_code,
                dang_name
              );
              if (dang_chi_tiet_code && dang_chi_tiet_name) {
                await createIfNotFind(
                  class_code,
                  subject_code,
                  dang_id,
                  dang_chi_tiet_code,
                  dang_chi_tiet_name
                );
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
})();
