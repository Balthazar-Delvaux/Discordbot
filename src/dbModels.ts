import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

interface MusicAttributes {
    id: number;
    guild_id: string;
    title: string;
    url: string;
    duration: string;
}

// Id is optional
interface MusicCreationAttributes extends Optional<MusicAttributes, "id"> { }

class Music extends Model<MusicAttributes, MusicCreationAttributes> implements MusicAttributes {
    public id!: number;
    public guild_id!: string;
    public title!: string;
    public url!: string;
    public duration!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}


 Music.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    guild_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    duration: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    modelName: `Musics`,
    sequelize
})

sequelize.sync()

export { Music }