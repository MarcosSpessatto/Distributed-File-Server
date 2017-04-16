import Mongo from '../db/mongo';

class DatabaseModel {

    constructor() {
        this.mongo = new Mongo().getConnection();
    }

    findOne(name) {
        return new Promise((resolve, reject) => {
            let query = {'name':  name};
            this.mongo.collection('files').findOne(query, (err, result) => (err ? reject(err) : resolve(result)));
        });
    }

    updateOne(data, name){
        return new Promise((resolve, reject) => {
            let query = {'name': name};
            this.mongo.collection('files').update(query, {$set: data}, (err, result) => (err ? reject(err) : resolve(result)))
        })
    }

    update(data, server){
        return new Promise((resolve, reject) => {
            let query = {'server': server};
            this.mongo.collection('files').update(query, {$set: data}, {multi: true}, (err, result) => (err ? reject(err) : resolve(result)))
        })
    }

    updateQueue(){
        return new Promise((resolve, reject) => {
            this.mongo.collection('balance').update({}, {$inc:{queue: 1}}, {multi:true}, (err, result) => (err ? reject(err) : resolve(result)))
        })
    }

    setBalancing(){
        return new Promise((resolve, reject) => {
            this.mongo.collection('balance').update({}, {$set: {balancing: true}}, (err, result) => (err ? reject(err) : resolve(result)))
        })
    }

    updateBalance(){
        return new Promise((resolve, reject) => {
            this.mongo.collection('balance').findOne({}, (err, result) => {
                if(result.queue > 0){
                    this.mongo.collection('balance').update({}, {$set:{balancing: false}, $inc: {queue: -1}}, {multi: true}, (err, result) => (err ? reject(err) : resolve(result)))
                }
            })
        })
    }

    insertFile(data, collection) {
        return new Promise((resolve, reject) => {
            this.mongo.collection(collection).insert(data, (err, result) => (err ? reject(err) : resolve(result)));
        })
    }

    getAll() {
        return new Promise((resolve, reject) => {
            this.mongo.collection('files').find({}, (err, result) => (err ? reject(err) : resolve(result)));
        })
    }

    isBalancing() {
        return new Promise((resolve, reject) => {
            this.mongo.getCollectionNames((err, result) => {
                if(!result.includes('balance')){
                    this.mongo.createCollection('balance', (err, result) => {
                        this.mongo.collection('balance')
                        .insert({balancing: false, queue: 0}, (err, result) => (err ? reject(err) : resolve(false)))
                    });
                } else {
                    this.mongo.collection('balance')
                        .findOne({}, (err, result) => {
                           if(err){
                               reject(err);
                           }
                           if(!result){
                               this.mongo.collection('balance')
                                   .insert({balancing: false, queue: 0}, (err, result) => (err ? reject(err) : resolve(result)))
                           } else {
                               resolve(result)
                           }
                        })
                }
            })
        })
    }

    delete(name) {
        return new Promise((resolve, reject) => {
            let query = {'name': name};
            this.mongo.collection('files').remove(query, (err, result) => (err ? reject(err) : resolve(result)));
        })
    }

    find(query, limit){
        return new Promise((resolve, reject) => {
            if(limit){
                this.mongo.collection('files').find(query).limit(limit, (err, result) => (err ? reject(err) : resolve(result)))
            } else {
                this.mongo.collection('files').find(query, (err, result) => (err ? reject(err) : resolve(result)))
            }
        })
    }

    getBestServer() {
        return new Promise((resolve, reject) => {
           this.mongo.collection('files')
                    .aggregate([{$match: {online: true}}, {$group: {_id: "$server", count: {$sum: 1}}}, {$sort: {count: 1}}], (err,result) => (err ? reject(err) : resolve(result)))
        })
    }
}

export default DatabaseModel