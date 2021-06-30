module.exports = (sequelize, DataTypes) => {
    return sequelize.define('commentary_db', {
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
        problem_answer: {
            type: DataTypes.STRING,
            allowNull: false
        },
        problem_commentary: {
            type: DataTypes.STRING,
            allowNull: false
        },
        problem_subject: {
            type: DataTypes.STRING,
            allowNull: false
        },
        problem_category: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        timestamps: false,
    });
}