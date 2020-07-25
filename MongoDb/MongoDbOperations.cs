using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using TestMongoDb.NoSqlContracts;
using Utilities;

namespace TestMongoDb
{
    public class MongoDbOperations : INoSqlOperations<ObjectId>
    {

        private string _host;
        private string _password;
        private string _userName;

        private string _databaseName;
        private string _collectionName;

        private MongoClient _client;
        private IMongoDatabase _database;

        /// <summary>
        /// CollectionName property must be set to the name of the collection in MongoDb instance 
        /// intended to be used with this class.
        /// No database operation can be performed without providing an appropriate value for
        /// this property.
        /// If a collection with this name does not exist in the given database, it will be created
        /// automatically, hence this property should only be taken from ApplicationConfig class.
        /// </summary>

        public string CollectionName
        {
            get { return _collectionName; }
            set { _collectionName = value; }
        }

        /// <summary>
        /// Default constructor of MongoDbOperations class intitializes Host, UserName
        /// database name and password properties to be used to connect CosmosDB by retrieving them
        /// from the ApplicationConfig class.
        /// It makes a call to the initialize private method to create an instance of
        /// MongoClient class which is used by all other database operation methods to
        /// carry out activities such as fetch, insert, update and delete.
        /// </summary>

        public MongoDbOperations()
        {
            _host = ApplicationConfig.NoSQLParameters.Host;
            _password = ApplicationConfig.NoSQLParameters.Password;
            _databaseName = ApplicationConfig.NoSQLParameters.DatabaseName;
            _userName = ApplicationConfig.NoSQLParameters.UserName;

            initialize();
        }

        /// <summary>
        /// This is an overloaded constructor of MongoDbOperations class that intitializes
        /// Host, UserName and password properties to be used to connect CosmosDB with the
        /// values provided to it as parameters.
        /// It makes a call to the initialize private method to create an instance of
        /// MongoClient class which is used by all other database operation methods to
        /// carry out activities such as fetch, insert, update and delete.
        /// </summary>

        public MongoDbOperations(string host, string userName, string databaseName, string password)
        {
            _host = host;
            _password = password;
            _userName = userName;
            _databaseName = databaseName;
            initialize();
        }

        /// <summary>
        /// initialize is a private method that initializes the MongoDB client object
        /// which is used for performing all the CosmosDB database operations.
        /// </summary>

        private void initialize()
        {
            MongoClientSettings settings = new MongoClientSettings();
            settings.Server = new MongoServerAddress(_host, 27017);
            //settings.Server = new MongoServerAddress(_host, 10255);
            //settings.UseSsl = true;
            //settings.SslSettings = new SslSettings();
            //settings.SslSettings.EnabledSslProtocols = SslProtocols.Tls12;

            //MongoIdentity identity = new MongoInternalIdentity(_databaseName, _userName);
            //MongoIdentityEvidence evidence = new PasswordEvidence(_password);

            //settings.Credentials = new List<MongoCredential>()
            //    {
            //        new MongoCredential("SCRAM-SHA-1", identity, evidence)
            //    };

            _client = new MongoClient(settings);
            _database = _client.GetDatabase(_databaseName);
        }

        /// <summary>
        /// Insert method allows developers to insert a document in the collection.
        /// The document can be an instance of any class that inmplements INoSqlEntity<ObjectId>.
        /// </summary>
        /// <typeparam name="T">T is a generic type parameter that allows Insert method to 
        /// accept an instance of INoSqlEntity<ObjectId> only.
        /// </typeparam>
        /// <param name="entity">Any class that implements INoSqlEntity<ObjectId> interface 
        /// can be passed as a parameter to this function.
        /// </param>

        public void Insert<T>(T entity) where T : INoSqlEntity<ObjectId>
        {
            if (_databaseName != null && _collectionName != null)
            {
                var mongoCollection = _database.GetCollection<T>(_collectionName);
                mongoCollection.InsertOne(entity);
            }
        }

        /// <summary>
        /// UpdateById method allows developers lookup a document by it's ID and update 
        /// a set of properties in it.
        /// The document can be an instance of any class that inmplements INoSqlEntity<ObjectId>.
        /// </summary>
        /// <typeparam name="T">T is a generic type parameter that allows UpdateById method to 
        /// accept an instance of INoSqlEntity<ObjectId> only.
        /// </typeparam>
        /// <param name="Id">Id of the document to be updated.</param>
        /// <param name="Updates">
        /// Developers can pass any number of instances of KeyValue class.
        /// Each instance of KeyValue class contains two properties, Key that represents the
        /// column to be updated and Value that represents the new value.
        /// </param>

        public void UpdateById<T>(string Id, params KeyValue[] Updates) where T : INoSqlEntity<ObjectId>
        {
            if (Id == null)
            {
                throw new InvalidOperationException("Id is provided.");
            }
            var objectId = new ObjectId(Id);
            Expression<Func<T, bool>> filter = (r) => r._id == objectId;

            UpdateOne<T>(filter, Updates);
        }

        /// <summary>
        /// UpdateOne method allows developers to lookup a document in the collection by
        /// specifying a filter criteria and update it.
        /// </summary>
        /// <typeparam name="T">T is a generic type parameter that allows UpdateOne method to 
        /// accept an instance of INoSqlEntity<ObjectId> only.
        /// </typeparam>
        /// <param name="filter">
        /// Its a function expression type parameter that can take a lambda expression which
        /// returns a boolean type.
        /// Eg. log => log.type == "Error"
        /// </param>
        /// <param name="Updates">
        /// Developers can pass any number of instances of KeyValue class.
        /// Each instance of KeyValue class contains two properties, Key that represents the
        /// column to be updated and Value that represents the new value.
        /// </param>

        public void UpdateOne<T>(Expression<Func<T, bool>> filter, params KeyValue[] updates) where T : INoSqlEntity<ObjectId>
        {
            if (filter == null || updates.Length == 0)
            {
                throw new InvalidOperationException("filter and updates cannot be empty.");
            }
            var mongoUpdate = Builders<T>.Update.Set(updates[0].Key, updates[0].Value);
            for (int i = 1; i < updates.Length; i++)
            {
                mongoUpdate.Set(updates[i].Key, updates[i].Value);
            }

            var mongoCollection = _database.GetCollection<T>(_collectionName);

            if (_databaseName != null && _collectionName != null)
            {
                mongoCollection.UpdateOne(filter, mongoUpdate);
            }
        }

        /// <summary>
        /// UpdateMany method allows developers to lookup many documents in the collection by
        /// specifying a filter criteria and update some of their properties.
        /// </summary>
        /// <typeparam name="T">T is a generic type parameter that allows UpdateMany method to 
        /// accept an instance of INoSqlEntity<ObjectId> only.
        /// </typeparam>
        /// <param name="filter">
        /// Its a function expression type parameter that can take a lambda expression which
        /// returns a boolean type.
        /// Eg. log => log.type == "Error"
        /// </param>
        /// <param name="Updates">
        /// Developers can pass any number of instances of KeyValue class.
        /// Each instance of KeyValue class contains two properties, Key that represents the
        /// column to be updated and Value that represents the new value.
        /// </param>

        public void UpdateMany<T>(Expression<Func<T, bool>> filter, params KeyValue[] updates) where T : INoSqlEntity<ObjectId>
        {
            if (filter == null || updates.Length == 0)
            {
                throw new InvalidOperationException("filter and updates cannot be empty.");
            }
            var mongoUpdate = Builders<T>.Update.Set(updates[0].Key, updates[0].Value);
            for (int i = 1; i < updates.Length; i++)
            {
                mongoUpdate.Set(updates[i].Key, updates[i].Value);
            }

            var mongoCollection = _database.GetCollection<T>(_collectionName);

            if (_databaseName != null && _collectionName != null)
            {
                mongoCollection.UpdateMany(filter, mongoUpdate);
            }
        }

        public void UpdateCustom<T>(Expression<Func<T, bool>> filter, params KeyValue[] updates) where T : INoSqlEntity<ObjectId>
        {
            if (filter == null || updates.Length == 0)
            {
                throw new InvalidOperationException("filter and updates cannot be empty.");
            }
            var mongoCollection = _database.GetCollection<T>(_collectionName);
            for (int i = 0; i < updates.Length; i++)
            {
                var mongoUpdate = Builders<T>.Update.Set(updates[i].Key, updates[i].Value);
                mongoUpdate.Set(updates[i].Key, updates[i].Value);

                if (_databaseName != null && _collectionName != null)
                {
                    mongoCollection.UpdateOne(filter, mongoUpdate);
                }
            }

        }
        /// <summary>
        /// This private function is called by UpdateOne and UpdateById public methods to
        /// perform update operation on the CosmosDB
        /// </summary>
        /// <typeparam name="T">T is a generic type parameter that allows UpdateOne method to 
        /// accept an instance of INoSqlEntity<ObjectId> only.
        /// </typeparam>
        /// <param name="filter">
        /// Its a function expression type parameter that can take a lambda expression which
        /// returns a boolean type.
        /// Eg. log => log.type == "Error"
        /// </param>
        /// <param name="mongoUpdate">
        /// This parameter is of type UpdateDefinition<T> that allows the developers to provide columns to be updated in the MongoDB
        /// database. It is collection class that can contain one of more columns to be updated.
        /// </param>

        private void UpdateOne<T>(Expression<Func<T, bool>> filter, UpdateDefinition<T> mongoUpdate)
        {
            var mongoCollection = _database.GetCollection<T>(_collectionName);
            if (_databaseName != null && _collectionName != null)
            {
                mongoCollection.UpdateOne(filter, mongoUpdate);
            }
        }

        /// <summary>
        /// PushInCollection method allows developers to lookup a documents in the collection by
        /// specifying a filter criteria and push the an instance of an Object in the a given array.
        /// </summary>
        /// <typeparam name="T">T is a generic type parameter that allows PushInCollection method to 
        /// accept an instance of INoSqlEntity<ObjectId> only.
        /// </typeparam>
        /// <typeparam name="Item">Item is a generic type parameter that allows PushInCollecion method to 
        /// accept an instance of any type that can be pushed into an array of type specified by the parametetr "field"
        /// </typeparam>
        /// <param name="filter">
        /// Its a function expression type parameter that can take a lambda expression which returns a boolean type.
        /// Eg. log => log._id == "a1233nca3"
        /// </param>
        /// <param name="field"> 
        /// Its a function expression type parameter that can take a lambda expression which returns an IEnumerable of type 
        /// specified in generic parameter "Item".
        /// </param>
        /// <param name="value">Value parameter contains the value to be pushed in the specified array</param>

        public void PushInCollection<T, Item>(Expression<Func<T, bool>> filter, Expression<Func<T, IEnumerable<Item>>> field, Item value)
            where T : INoSqlEntity<ObjectId>
        {
            if (filter == null)
            {
                throw new InvalidOperationException("filter cannot be empty.");
            }

            var mongoUpdate = Builders<T>.Update.Push<Item>(field, value);

            var mongoCollection = _database.GetCollection<T>(_collectionName);
            mongoCollection.FindOneAndUpdate(filter, mongoUpdate);
        }


        /// <summary>
        /// ReplaceOne method allows developers to lookup a document and replace 
        /// it with another one. After the replace operation is performed the values
        /// of old document will be replaced with the new one except it _id column.
        /// </summary>
        /// <typeparam name="T">T is a generic type parameter that allows ReplaceOne method to 
        /// accept an instance of INoSqlEntity<ObjectId> only.
        /// </typeparam>
        /// <param name="filter">
        /// Its a function expression type parameter that can take a lambda expression that
        /// returns a boolean type.
        /// Eg. reg => reg.AccountId == "15736343523"
        /// </param>
        /// <param name="value"></param>
        /// <returns></returns>

        public bool ReplaceOne<T>(Expression<Func<T, bool>> filter, T value) where T : INoSqlEntity<ObjectId>
        {
            var mongoCollection = _database.GetCollection<T>(_collectionName);
            var existingRecord = mongoCollection.Find(filter).FirstOrDefault();
            if (existingRecord != null)
            {
                value._id = existingRecord._id;
                mongoCollection.ReplaceOne(filter, value);
                return true;
            }
            return false;
        }

        /// <summary>
        /// DeleteOneById method allows developers to lookup a document and delete
        /// from the collection.
        /// </summary>
        /// <typeparam name="T">T is a generic type parameter that allows DeleteOneById
        /// method to accept an instance of INoSqlEntity<ObjectId> only.
        /// </typeparam>
        /// <param name="Id">Id of the document to be deleted.</param>
        /// <returns>Returns number of documents affected. It will either 1 or O in case 
        /// there were no matching documents.
        /// </returns>

        public long DeleteOneById<T>(string Id) where T : INoSqlEntity<ObjectId>
        {
            if (Id == null)
            {
                throw new InvalidOperationException("Id is provided.");
            }
            var objectId = new ObjectId(Id);
            Expression<Func<T, bool>> filter = (r) => r._id == objectId;
            return this.DeleteOne(filter);
        }

        /// <summary>
        /// DeleteOne method allows developers to lookup a document and delete it.  
        /// </summary>
        /// <typeparam name="T">T is a generic type parameter that allows DeleteOne
        /// method to accept an instance of INoSqlEntity<ObjectId> only.
        /// </typeparam>
        /// <param name="filter">
        /// Its a function expression type parameter that can take a lambda expression which
        /// returns a boolean type.
        /// Eg. reg => reg.AccountId == "15736343523"
        /// </param>
        /// <returns>Returns number of documents affected. It will either 1 or O in case 
        /// there were no matching documents.
        /// </returns>

        public long DeleteOne<T>(Expression<Func<T, bool>> filter) where T : INoSqlEntity<ObjectId>
        {
            var mongoCollection = _database.GetCollection<T>(_collectionName);
            DeleteResult result = mongoCollection.DeleteOne(filter);
            return result.DeletedCount;
        }

        /// <summary>
        /// DeleteMany method allows developers to lookup document and delete them from the
        /// collection.  
        /// </summary>
        /// <typeparam name="T">T is a generic type parameter that allows DeleteMany
        /// method to accept an instance of INoSqlEntity<ObjectId> only.
        /// </typeparam>
        /// <param name="filter">
        /// Its a function expression type parameter that can take a lambda expression which
        /// returns a boolean type.
        /// Eg. reg => reg.State == "S"
        /// </param>
        /// <returns>Returns number of documents affected or O in case 
        /// there were no matching documents.
        /// </returns>

        public long DeleteMany<T>(Expression<Func<T, bool>> filter) where T : INoSqlEntity<ObjectId>
        {
            var mongoCollection = _database.GetCollection<T>(_collectionName);
            DeleteResult result = mongoCollection.DeleteMany(filter);
            return result.DeletedCount;
        }

        /// <summary>
        /// FetchById function allows developers to fetch a CosmosDb document based
        /// on the ID provided as a parameter to it.
        /// </summary>
        /// <typeparam name="T">T is a generic type parameter that allows FetchById
        /// method to accept an instance of INoSqlEntity<ObjectId> only.
        /// </typeparam>
        /// <param name="Id">Id of the document to be fetched.</param>
        /// <returns>Returns the required document from CosmosDB.</returns>

        public T FetchById<T>(string Id) where T : INoSqlEntity<ObjectId>
        {
            if (Id == null)
            {
                throw new InvalidOperationException("Id is provided.");
            }
            var objectId = new ObjectId(Id);
            Expression<Func<T, bool>> filter = (r) => r._id == objectId;

            return FetchOne(filter);
        }

        /// <summary>
        /// FetchOne function allows developers to fetch a CosmosDb document based
        /// on the filter critria provided as a parameter to it.
        /// </summary>
        /// <typeparam name="T">T is a generic type parameter that allows FetchOne
        /// method to accept an instance of INoSqlEntity<ObjectId> only.
        /// </typeparam>
        /// <param name="filter">
        /// Its a function expression type parameter that can take a lambda expression which
        /// returns a boolean type.
        /// Eg. reg => reg.State == "S"
        /// </param>
        /// <returns>Returns the required document from CosmosDB.</returns>

        public T FetchOne<T>(Expression<Func<T, bool>> filter) where T : INoSqlEntity<ObjectId>
        {
            var mongoCollection = _database.GetCollection<T>(_collectionName);
            var fetchResult = mongoCollection.Find(filter);
            if (fetchResult == null || fetchResult.Count() == 0)
            {
                return default(T);
            }
            return fetchResult.FirstOrDefault();
        }

        /// <summary>
        /// Fetch function allows developers to fetch multiple CosmosDb documents based
        /// on the filter critria provided as a parameter to it.
        /// </summary>
        /// <typeparam name="T">T is a generic type parameter that allows Fetch
        /// method to accept an instance of INoSqlEntity<ObjectId> only.
        /// </typeparam>
        /// <param name="filter">
        /// Its a function expression type parameter that can take a lambda expression which
        /// returns a boolean type.
        /// Eg. reg => reg.State == "S"
        /// </param>
        /// <returns>Returns the required documents in the from of List<T> from CosmosDB.</returns>
        public List<T> Fetch<T>(Expression<Func<T, bool>> filter) where T : INoSqlEntity<ObjectId>
        {
            var mongoCollection = _database.GetCollection<T>(_collectionName);
            return mongoCollection.Find(filter).ToList();
        }

        public List<dynamic> Fetchh<dynamic>(Expression<Func<dynamic, bool>> filter) where dynamic : INoSqlEntity<ObjectId>
        {
            var mongoCollection = _database.GetCollection<dynamic>(_collectionName);
            return mongoCollection.Find(filter).ToList();
        }
    }
}


