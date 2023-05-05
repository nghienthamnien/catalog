module.exports = (sequelize, DataTypes) => {
  const CatalogHierarchy = sequelize.define(
    "CatalogHierarchy",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      child_id: { type: DataTypes.INTEGER, allowNull: false },
      parent_id: { type: DataTypes.INTEGER, allowNull: false },
      depth: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      tableName: "catalog_hierarchy",
      timestamps: false,
    }
  );
  CatalogHierarchy.associate = model => {
    CatalogHierarchy.belongsTo(model.Catalog, {
      as: "parentCatalog",
      foreignKey: "parent_id",
    });
    CatalogHierarchy.belongsTo(model.Catalog, {
      as: "thisCatalog",
      foreignKey: "child_id",
    });
  };
  return CatalogHierarchy;
};
