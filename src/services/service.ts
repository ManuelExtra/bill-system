/*!
 * Services structure
 */

'use strict'

export default (model:any) => {
    var dbModel = model
    return {
        getModel() {
            return dbModel
        },
        add(details:any, session?:any) {
            return new Promise((resolve, reject) => {
                try {
                    const dbmodel = new dbModel(details)
                    let result = dbmodel.save({session})
                    return resolve(result)
                } catch (err) {
                    return reject(err)
                }
            })
        },
        update(filter:any, updates?:any) {
            return new Promise((resolve, reject) => {
                try {
                    let response = dbModel.findOneAndUpdate(filter, updates, {
                        new: true
                    })
                    return resolve(response)
                } catch (err) {
                    return reject(err)
                }
            })
        },
        get(filter:any) {
            return new Promise((resolve, reject) => {
                try {
                    let response = dbModel.find(filter)
                    return resolve(response)
                } catch (err) {
                    return reject(err)
                }
            })
        },
        getByRel(filter:any, collection?: any) {
            return new Promise((resolve, reject) => {
                try {
                    let response = dbModel.find(filter).populate(collection)
                    return resolve(response)
                } catch (err) {
                    return reject(err)
                }
            })
        },
        getById(filter:any) {
            return new Promise((resolve, reject) => {
                try {
                    let response = dbModel.findById(filter)
                    return resolve(response)
                } catch (err) {
                    return reject(err)
                }
            })
        },
        getOne(filter: any, attributes?: any) {
            return new Promise((resolve, reject) => {
                try {
                    let response = dbModel.findOne(filter, attributes)
                    return resolve(response)
                } catch (err) {
                    return reject(err)
                }
            })
        },
        delete(filter: any) {
            return new Promise((resolve, reject) => {
                try {
                    let response = dbModel.findOneAndDelete(filter)
                    return resolve(response)
                } catch (err) {
                    return reject(err)
                }
            })
        }
    }
}
