using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using TestMongoDb.NoSqlContracts;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;
using Utilities;

namespace TestMongoDb.DTOWrappers
{

    public class ProjectsWrapper : INoSqlEntity<ObjectId>
    {
        public ObjectId _id { get; set; }

        public ProjectDTO projectsdetail { get; set; }
    }

    public class ProjectDTO
    {
        //[BsonId(IdGenerator = typeof(CombGuidGenerator))]
        //public Guid id { get; set; }
        [BsonId(IdGenerator = typeof(CombGuidGenerator))]
        public Guid projectid { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string version { get; set; }
        public List<ModelDTO> model { get; set; }

    }

    public class ModelDTO
    {
        public string modelid { get; set; }
        public string name { get; set; }
        public string version { get; set; }
        public List<ModelflowDTO> modelflow { get; set; }
    }

    public class ModelflowDTO
    {
        public string connectionid { get; set; }
        public string pagesourceid { get; set; }
        public string pagetargetid { get; set; }
    }

}