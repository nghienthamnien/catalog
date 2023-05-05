const db = require("../model");
const { Catalog, CatalogHierarchy } = db;
const { Op } = require("sequelize");
const _ = require("lodash");
module.exports = async () => {
  // Tim tat ca cac node trong cay
  const result = await CatalogHierarchy.findAll({
    attributes: ["depth"],
    include: {
      attributes: ["id", "name", "parent_id", "is_leaf"],
      model: Catalog,
      as: "thisCatalog",
    },
    where: {
      parent_id: {
        [Op.in]: db.sequelize.literal(
          `(SELECT id FROM catalog where parent_id=0)`
        ),
      },
    },
    order: [[{ model: Catalog, as: "thisCatalog" }, "order", "ASC"]],
  });

  // build tree
  let tree = [];
  let mapIdtoObj = {};
  result.forEach(treeNode => {
    let newTreeNode = _.cloneDeep(treeNode.thisCatalog.dataValues);
    newTreeNode.depth = treeNode.depth;
    if (!newTreeNode.is_leaf) newTreeNode.children = [];
    mapIdtoObj[newTreeNode.id] = _.cloneDeep(newTreeNode);
  });

  for (let id in mapIdtoObj) {
    if (mapIdtoObj.hasOwnProperty(id)) {
      let treeNode = mapIdtoObj[id];
      if (treeNode.depth > 0) {
        mapIdtoObj[treeNode.parent_id].children.push(treeNode);
      } else {
        tree.push(treeNode);
      }
    }
  }
  return tree;
};
