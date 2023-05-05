const db = require("../model");
async function addNodeToClousreTable(parent_id, child_id) {
  let rawQuery = `insert into catalog_hierarchy(parent_id, child_id, depth)
    select p.parent_id, c.child_id, p.depth+c.depth+1
      from catalog_hierarchy p, catalog_hierarchy c
     where p.child_id=:PARENT_ITEM and c.parent_id=:CHILD_ITEM`;
  try {
    await db.sequelize.query(rawQuery, {
      replacements: { PARENT_ITEM: parent_id, CHILD_ITEM: child_id },
      type: db.sequelize.QueryTypes.INSERT,
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = addNodeToClousreTable;
