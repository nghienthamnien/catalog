const db = require("../model");
const { Catalog, CatalogHierarchy } = db;

const data = [
  {
    id: 2,
    name: "Lớp 2",
    order: 2,
    parent_id: 0,
    root_path: [],
  },
  {
    id: 3,
    name: "Lớp 3",
    order: 3,
    parent_id: 0,
    root_path: [],
  },
  {
    id: 4,
    name: "Lớp 4",
    order: 4,
    parent_id: 0,
    root_path: [],
  },
  {
    id: 5,
    name: "Lớp 5",
    order: 5,
    parent_id: 0,
    root_path: [],
  },
  {
    id: 6,
    name: "Lớp 6",
    order: 6,
    parent_id: 0,
    root_path: [],
  },
  {
    id: 7,
    name: "Lớp 7",
    order: 7,
    parent_id: 0,
    root_path: [],
  },
  {
    id: 8,
    name: "Lớp 8",
    order: 8,
    parent_id: 0,
    root_path: [],
  },
  {
    id: 9,
    name: "Lớp 9",
    order: 9,
    parent_id: 0,
    root_path: [],
  },
  {
    id: 10,
    name: "Lớp 10",
    order: 10,
    parent_id: 0,
    root_path: [],
  },
  {
    id: 11,
    name: "Lớp 11",
    order: 11,
    parent_id: 0,
    root_path: [],
  },
  {
    id: 12,
    name: "Lớp 12",
    order: 12,
    parent_id: 0,
    root_path: [],
  },
];
(async () => {
  const t = await db.sequelize.transaction();
  try {
    for await (const row of data) {
      await Catalog.create(row, { transaction: t });
      await CatalogHierarchy.create(
        {
          parent_id: row.id,
          child_id: row.id,
          depth: 0,
        },
        { transaction: t }
      );
    }
    await t.commit();
  } catch (error) {
    await t.rollback();
  }
})();
