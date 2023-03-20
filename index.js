const fs = require('fs')
const path = require('path')


class Database{
    createcluster(databaseName){
        if (fs.existsSync(path.join(__dirname,databaseName))) {
            throw new Error(`database ${databaseName} already exists`)
        }else{
            fs.mkdirSync(path.join(__dirname,databaseName))
        }
    }
    createledger(databaseName,ledgerName){
        const ledgerpath = path.join(databaseName,`${ledgerName}.json`)

        if (fs.existsSync(ledgerpath)) {
            throw new Error('Ledger Document already in the cluster please verify')
        }

        const data = [ ]
        fs.writeFileSync(ledgerpath,JSON.stringify(data))
    }
    insert(databaseName,ledgerName,data){
        const ledgerpath = path.join(databaseName,`${ledgerName}.json`)

        if (!fs.existsSync(ledgerpath)) {
            throw new Error('the cluster does not exists')
        }

        const ledgerdata = JSON.parse(fs.readFileSync(ledgerpath))

        ledgerdata.push(data)
        fs.writeFileSync(ledgerpath,JSON.stringify(ledgerdata))
    }

    Query(databaseName,ledgerName,QUERY_FUNCTION){
        const ledgerpath = path.join(databaseName,`${ledgerName}.json`)

        if (!fs.existsSync(ledgerpath)) {
            throw new Error('the cluster does not exists')
        }
        const ledgerdata = JSON.parse(fs.readFileSync(ledgerpath))
        const queries = ledgerdata.filter(QUERY_FUNCTION)
        return queries
    }

    update(databaseName,ledgerName,QUERY_FUNCTION,updatedata){
        const ledgerpath = path.join(databaseName,`${ledgerName}.json`)

        if (!fs.existsSync(ledgerpath)) {
            throw new Error('the cluster does not exists')
        }
        const ledgerdata = JSON.parse(fs.readFileSync(ledgerpath))

        ledgerdata.forEach(row => {
            if (QUERY_FUNCTION(row)) {
                Object.keys(updatedata).forEach(key=>{
                    row[key] = updatedata[key]
                })
            }
        });
        fs.writeFileSync(ledgerpath,JSON.stringify(ledgerdata))
    }
    delete(databaseName,ledgerName,QUERY_FUNCTION){

        const ledgerpath = path.join(databaseName,`${ledgerName}.json`)
        if (!fs.existsSync(ledgerpath)) {
            throw new Error('the cluster does not exists')
        }

        let ledgerdata = JSON.parse(fs.readFileSync(ledgerpath))

        const deleteQuery = ledgerdata.filter(row => !QUERY_FUNCTION(row))
        ledgerdata = deleteQuery
        fs.writeFileSync(ledgerpath,JSON.stringify(ledgerdata))
    }
    clusterSearch(databaseName,unique_key,unique_Identity){
        const readDB = fs.readdirSync(databaseName)
        const nodedata = []

        readDB.map(files =>{
            const locate = path.join(databaseName,files)
            const read = JSON.parse(fs.readFileSync(locate))
            read.map(data =>{
                if (data[unique_key] === unique_Identity){
                    nodedata.push(data)
                }
            })
        })
        return nodedata
    }
    Macrosearch(arrayofdatabase,unique_key,unique_Identity){
        const nodedata = []
        arrayofdatabase.forEach(db=>{
            const readdb = fs.readdirSync(db)
            readdb.map(files=>{
                const locate = path.join(db,files)
                const read = JSON.parse(fs.readFileSync(locate))
                read.forEach(data =>{
                    if (data[unique_key] === unique_Identity) {
                        nodedata.push(data)
                    }
                })
            })
        })
        return nodedata
    }

}

// const db = new Database()
// db.createcluster('mydatabase')
// db.createledger('mydatabase','users')
// db.insert('mydatabase','users',{name:'mehul',phonenumber:997744689,age:17})
// const q = db.Query('mydatabase','users',()=>true)
// db.update('mydatabase','users',row=>row.name === 'meahul',{age : 17})
// db.delete('mydatabase','users',data=>data.age < 18)
// const search = db.clusterSearch('mydatabase','phonenumber',9876543210); console.log(search);
// search.map(v=>{
//     console.log(v.productname);
// })

// db.createcluster('mydatabase')
// db.createledger('mydatabase','orders')
// db.insert('mydatabase','orders',{productname:'Samsung', phonenumber:9876543210 , price : 190000})
// const q = db.Query('mydatabase','orders',()=>true); console.log(q)
// db.update('mydatabase','orders',row=>row.productname === 'Samsung',{pid : 23})
// db.delete('mydatabase','orders',data=>data.phonenumber === 997744689)


// db.createcluster('mydatabase2')
// db.createledger('mydatabase2','links')
// db.insert('mydatabase2','links',{links:'many',phonenumber:9876543210,active:'2yrs'})
// const q = db.Query('mydatabase2','links',()=>true); console.log(q)
// db.update('mydatabase2','links',row=>row.links === 'many',{on : true})
// db.delete('mydatabase','users',data=>data.age < 18)
// const search = db.clusterSearch('mydatabase','phonenumber',9876543210); console.log(search);
// const macro = db.Macrosearch(['mydatabase','mydatabase2'],'phonenumber',9876543210)
// macro.map(v=>{
//     console.log(v);
// })


