import { PiDatabasePool, PiDatabase, promisifyAll } from "@pomgui/database";
import { PiMySqlDatabase } from "./pi-mysql-database";

export class PiMySqlPool implements PiDatabasePool {
    private _pool: any; // mysql.Pool
    private _ID = 0;

    /**
     * @param _options require('mysql).PoolConfig
     * @param size Pool size
     */
    constructor(private _options: object, size = 10) {
        this._options = Object.assign({ connectionLimit: size }, _options);
        this._pool = require('mysql').createPool(this._options); // hack 'cause webpack
        promisifyAll(this._pool, ['getConnection']);
    }

    async get(): Promise<PiDatabase> {
        let db = await this._pool.getConnection();
        if (!db._ID)
            db._ID = ++this._ID;
        return new PiMySqlDatabase(db);
    }

}