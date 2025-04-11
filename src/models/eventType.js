import utils from '../helper/utils.js';
export default function (sequelize, DataTypes) {
  const EventType = sequelize.define(
    'EventType',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Or DataTypes.UUIDV1
        primaryKey: true,
      },
      title: {
        type: DataTypes.CHAR,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      durationMinutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // location: {
      //   type: DataTypes.TEXT,
      //   allowNull: false,
      // },
    },
    {
      hooks: {
        beforeSave: (attributes) => {
          attributes.set('slug', utils.slugify(attributes.get('title')));
        },
      },
      paranoid: true, // Enables soft deletes
    },
  );

  EventType.associate = (models) => {
    EventType.belongsTo(models.User, {
      foreignKey: {
        fieldName: 'userId',
      },
    });
  };

  return EventType;
}
