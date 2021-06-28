module.exports = (sequelize, DataTypes) => {
    return sequelize.define('problem_db', {
        problem_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        problem_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        problem_description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        problem_lavel: {
            type: DataTypes.STRING,
            allowNull: false
        },
        problem_category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        questioner: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        problem_createday: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });
}