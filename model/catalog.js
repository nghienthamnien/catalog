module.exports = (sequelize, DataTypes) => {
  const Catalog = sequelize.define(
    "Catalog",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      for_class: {
        type: DataTypes.TINYINT(4),
      },
      subject_code: {
        type: DataTypes.STRING(45),
      },
      book_type: {
        type: DataTypes.STRING(45),
      },
      name: {
        type: DataTypes.STRING(512),
        allowNull: false,
      },
      parent_id: DataTypes.INTEGER,
      last_edit_by: { type: DataTypes.STRING(255) },
      last_edit_at: {
        type: DataTypes.DATE,
      },
      root_path: {
        type: DataTypes.JSON,
      },
      is_leaf: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      order: { type: DataTypes.INTEGER },
    },
    {
      tableName: "Catalog",
      timestamps: true,
    }
  );

  Catalog.associate = db => {
    Catalog.hasMany(db.CatalogHierarchy, {
      as: "parent",
      foreignKey: "parent_id",
    });
    Catalog.hasMany(db.CatalogHierarchy, {
      as: "child",
      foreignKey: "child_id",
    });
  };

  return Catalog;
};
