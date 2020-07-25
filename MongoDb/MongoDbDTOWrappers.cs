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
    public class ScriptsWrapper : INoSqlEntity<ObjectId>
    {
        public ObjectId _id { get; set; }

        public string keyword { get; set; }
        public List<Script> script { get; set; }
    }

    public class LoginDetails : INoSqlEntity<ObjectId>
    {
        public ObjectId _id { get; set; }

        public string UserId { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Company { get; set; }
        public string Status { get; set; }
        //public string StartDate { get; set; }
        //public string EndDate { get; set; }
    }

    public class CompLicense : INoSqlEntity<ObjectId>
    {
        public ObjectId _id { get; set; }

        public string Company { get; set; }
        public string NumberOfUsersPerLicense { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
    }

    public class UserDetails
    {
        public string UserId { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Company { get; set; }
        public string NumberOfUsersPerLicense { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
    }

    public class Script
    {
        public string scriptId { get; set; }
        public string javaScript { get; set; }
        public string pythonScript { get; set; }
    }

    public class ProjectsWrapper : INoSqlEntity<ObjectId>
    {
        public ObjectId _id { get; set; }

        public ProjectDTO projectsdetail { get; set; }
    }

    public class ProjectDTO
    {
        //public ProjectDTO()
        //{
        //    //if (string.IsNullOrEmpty(projectid))
        //    //{
        //    //    projectid = Convert.ToString(Guid.NewGuid());
        //    //}

        //}

        //[BsonId(IdGenerator = typeof(CombGuidGenerator))]
        public string projectid { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string version { get; set; }
        public string createdBy { get; set; }
        public string accessList { get; set; }
        public List<ModelDTO> module { get; set; }
    }


    //public class ProjectInfo
    //{
    //    //[BsonId(IdGenerator = typeof(CombGuidGenerator))]
    //    public string projectid { get; set; }
    //    public string name { get; set; }
    //    public string description { get; set; }
    //    public string version { get; set; }
    //    public List<ModelDTO> module { get; set; }
    //}

    public class ModelDTO
    {
        //public ModelDTO()
        //{
        //    //if (string.IsNullOrEmpty(moduleid))
        //    //{
        //    //    moduleid = Convert.ToString(Guid.NewGuid());
        //    //}
        //}

        public string moduleid { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string version { get; set; }
        public List<RequirementsDTO> requirements { get; set; }
        public List<ModelflowDTO> modelflow { get; set; }
    }

    public class ModelflowDTO
    {
        //public ModelflowDTO()
        //{
        //    //if (string.IsNullOrEmpty(modelflowid))
        //    //{
        //    //    modelflowid = Convert.ToString(Guid.NewGuid());
        //    //}
        //}

        public string modelflowid { get; set; }
        public string modelflowname { get; set; }
        public string description { get; set; }
        public string version { get; set; }
        public List<Nodes> nodes { get; set; }
        public List<Connections> connections { get; set; }
        public List<ErnTData> ExpectedResultTdata { get; set; }
        public string numberOfElements { get; set; }
        public string parentFlowid { get; set; }
    }

    public class RequirementsDTO
    {
        public string reqid { get; set; }
        public string reqname { get; set; }
        public string description { get; set; }
        public string accCriteria { get; set; }
    }

    public class Nodes
    {
        public string blockId { get; set; }
        public string nodetype { get; set; }
        public string positionX { get; set; }
        public string positionY { get; set; }
        public string DisplayText { get; set; }
    }

    public class Connections
    {
        //public string connectionId { get; set; }
        public string pageSourceId { get; set; }
        public string pageTargetId { get; set; }
        public string overlay { get; set; }
    }

    public class ErnTData
    {
        public string row_Id { get; set; }
        //public string ts;
        public string TestStep { get; set; }



        private string ex = "";
        public string ExpectedResult { get { return ex; } set { if (value == null) ex = ""; else ex = value;} }

        private string tData;
        public string TestData { get { return tData; } set { if (value == null) tData = ""; else tData = value; } }

        private string AtData;
        public string AutomationTestData { get { return AtData; } set { if (value == null) AtData = ""; else AtData = value; } }



    }

}