module.exports = (sequelize, DataTypes) => {
    return sequelize.define('classroom_db', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        class_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        class_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        class_pwd: {
            type: DataTypes.STRING,
            allowNull: false
        },
        teacher: {
            type: DataTypes.STRING,
            allowNull: false
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false
        },   
        education_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        class_time: {
            type: DataTypes.STRING,
            allowNull: false
        },
        class_status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        class_information: {
            type: DataTypes.STRING,
            allowNull: false
        },
        class_host: {
            type: DataTypes.STRING,
            allowNull: false
        },
        limit_join: {
            type: DataTypes.BIGINT,
            allowNull: 0
        },
        class_created: {
            type: DataTypes.DATE,
            allowNull: false
        },
    }, {
        timestamps: false,
    });
}