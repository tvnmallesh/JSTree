using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace TestMongoDb.NoSqlContracts
{

    public interface INoSqlOperations<I>
    {
        T FetchById<T>(string Id) where T : INoSqlEntity<I>;
        T FetchOne<T>(Expression<Func<T, bool>> filter) where T : INoSqlEntity<I>;
        List<T> Fetch<T>(Expression<Func<T, bool>> filter) where T : INoSqlEntity<I>;

        void Insert<T>(T entity) where T : INoSqlEntity<I>;
        void UpdateById<T>(string id, params KeyValue[] update) where T : INoSqlEntity<I>;
        void UpdateOne<T>(Expression<Func<T, bool>> filter, params KeyValue[] updates) where T : INoSqlEntity<I>;
        void UpdateMany<T>(Expression<Func<T, bool>> filter, params KeyValue[] updates) where T : INoSqlEntity<I>;

        void PushInCollection<T, Item>(Expression<Func<T, bool>> filter, Expression<Func<T, IEnumerable<Item>>> field, Item value)
            where T : INoSqlEntity<I>;

        bool ReplaceOne<T>(Expression<Func<T, bool>> filter, T value) where T : INoSqlEntity<I>;
        long DeleteOneById<T>(string Id) where T : INoSqlEntity<I>;
        long DeleteOne<T>(Expression<Func<T, bool>> filter) where T : INoSqlEntity<I>;
        long DeleteMany<T>(Expression<Func<T, bool>> filter) where T : INoSqlEntity<I>;
    }

    public interface INoSqlEntity<T>
    {
        T _id { get; set; }
    }

    public class KeyValue
    {
        public static KeyValue set(string key, object value)
        {
            return new KeyValue(key, value);
        }

        public KeyValue(string key, object value)
        {
            Key = key;
            Value = value;
        }

        public string Key { get; set; }
        public object Value { get; set; }

    }

}
