# MySQL Database library

[![Package Version][package-image]][package-url]
[![Open Issues][issues-image]][issues-url]

@pomgui/database-mysql is a typescript library that provides an interface to execute the normal operations
with a client [mysql](https://www.npmjs.com/package/mysql) 
database driver as connect, start transaction, commit, etc.

## Advantages:

- All methods return promises.
- It uses query parameters like `:id` instead of `?`.
- The parameters understand object's hierarchy, so it understands parameters like `:entry.id`.
- The returned rows also are preprocessed to return nested objects if needed (See Usage Example section).
- It maintains the same interface ([@pomgui/database][base-url]) no matter the database, so it helps with the migration from different databases E.g. MySQL to Firebird or to PostgreSQL and vice versa
  (See [@pomgui/database-pg][database-pg-url] usage example and compare)

## Installation

Use npm to install the library.

```bash
npm install @pomgui/database-mysql --save
```

## Usage Example

```typescript
const options = {
    host: 'localhost',
    user: 'user',
    password: 'secret',
    database: 'test'
};

async work(){
    const pool = new PiMySqlPool(options, 10);
    const db = await pool.get();
    await db.beginTransaction();
    try{
        const param = {entry: {id: 3}};
        const data = await db.query(`
            SELECT 
                e.entry_id "id", e.entry_date, 
                b.benef_id "benef.id", b.name "benef.name"
            FROM ENTRIES e JOIN BENEFICIARIES db ON b.benef_id = e.benef_id
            WHERE entry_id >= :entry.id
            LIMIT 0,10`, param);
        console.log(data);
        await db.commit();
    }catch(err){
        console.error(err);
        await db.rollback();
    }finally{
        await db.close();
    }
}
```

This will print:

```javascript
[{  id: 3, 
    entryDate: 2020-08-01T00:00:00.000Z,
    benef: {
        id: 1,
        name: 'John Doe'
    }
},{  id: 4, 
    date: 2020-08-02T00:00:00.000Z,
    benef: {
        id: 1,
        name: 'Jane Doe'
    }
}, ...
]
```




[base-url]: https://www.npmjs.com/package/@pomgui/database
[project-url]: https://github.com/pomgui/database-mysql
[database-pg-url]: https://www.npmjs.com/package/@pomgui/database-pg
[package-image]: https://badge.fury.io/js/@pomgui%2Fdatabase-mysql.svg
[package-url]: https://badge.fury.io/js/@pomgui%2Fdatabase-mysql
[issues-image]: https://img.shields.io/github/issues/pomgui/database-mysql.svg?style=popout
[issues-url]: https://github.com/pomgui/database-mysql/issues
