using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Configuration;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TestMongoDb;
using Utilities;
using TestMongoDb.NoSqlContracts;
using TestMongoDb.DTOWrappers;
using Newtonsoft.Json;
using System.Web;

namespace TestAPIService.Controllers
{
    [RoutePrefix("TestProject")]
    public class ProjectController : ApiController
    {
        // GET: TestProject/GetCollections
        [HttpGet]
        [Route("GetProjectDetails/{createdBy}")]
        public IHttpActionResult Get(string createdBy)
        {
            try
            {
                return Ok(GetProjectCollectionInfo(string.Empty, createdBy));
            }
            catch (Exception ex)
            {
                return BadRequest("Error occured...!!");
            }
        }

        // GET: TestProject/5
        [HttpGet]
        [Route("GetProjectDetails/{id}/{createdBy}")]
        public IHttpActionResult Get(string id, string createdBy)
        {
            try
            {
                return Ok(GetProjectCollectionInfo(id, createdBy));
            }
            catch (Exception ex)
            {
                return BadRequest("Error occured...!!");
            }
        }

        // POST: TestProject/10
        // POST: api/TestProject
        [HttpPost]
        [Route("CreateProjectDetail")]
        //public IHttpActionResult Post([FromBody] ProjectDTO objProject)
        public IHttpActionResult Post([FromBody]ProjectDTO objProject)
        {
            try
            {
                //ProjectDTO objPro = JsonConvert.DeserializeObject<ProjectDTO>(objProject);
                return Ok(InsertProjects(objProject));
            }
            catch (Exception ex)
            {
                return BadRequest("Error occured...!!");
            }
        }

        [HttpPost]
        [Route("ShareWith/{ids}/{projectid}")]
        public IHttpActionResult ShareFlowWith(string ids, string projectid)
        {
            try
            {
                return Ok(ShareFlowWithUser(ids, projectid));
            }
            catch (Exception ex)
            {
                return BadRequest("Error occured...!!");
            }
        }

        // PUT: TestProject/UpdateProjectDetail/5
        // PUT: api/TestProject/5
        [HttpPut]
        [Route("UpdateProjectDetail/{id}")]
        public IHttpActionResult Put(string id, [FromBody]ProjectDTO objProject)
        {
            try
            {
                return Ok(UpdateProject(id, objProject));
            }
            catch (Exception ex)
            {
                return BadRequest("Error occured...!!");
            }
        }

        // PUT: TestProject/UpdateModuleDetail/5
        // PUT: api/TestProject/5
        [HttpPut]
        [Route("UpdateModuleDetail/{id}")]
        public IHttpActionResult Put(string id, [FromBody]ModelDTO objmodule)
        {
            try
            {
                //UpdateModule(id, objmodule);
                return Ok(UpdateModule(id, objmodule));
            }
            catch (Exception ex)
            {
                return BadRequest("Error occured...!!");
            }
        }

        [HttpPut]
        [Route("DeleteModuleDetail/{id}")]
        public IHttpActionResult DeleteProjectModule(string id, [FromBody]ModelDTO objmodule)
        {
            try
            {
                //UpdateModule(id, objmodule);
                return Ok(DeleteModule(id, objmodule));
            }
            catch (Exception ex)
            {
                return BadRequest("Error occured...!!");
            }
        }

        [HttpPut]
        [Route("UpdateModelFlowDetail/{projectid}/{projectname}/{moduleid}/{publishAsVersion}")]
        public IHttpActionResult Put(string projectid, string projectname, string moduleid, [FromBody]ModelflowDTO objmodelflow, bool publishAsVersion)
        {
            try
            {
                return Ok(UpdateModelflow(projectid, projectname, moduleid, objmodelflow, publishAsVersion));
            }
            catch (Exception ex)
            {
                return BadRequest("Error occured...!!");
            }
        }

        [HttpPut]
        [Route("UpdateReq/{projectid}/{projectname}/{moduleid}/{publishAsVersion}")]
        public IHttpActionResult UpdateRequirement(string projectid, string projectname, string moduleid, [FromBody]RequirementsDTO objreq, bool publishAsVersion)
        {
            try
            {
                return Ok(UpdateReq(projectid, projectname, moduleid, objreq, publishAsVersion));
            }
            catch (Exception ex)
            {
                return BadRequest("Error occured...!!");
            }
        }


        [HttpPut]
        [Route("DeleteModelFlowDetail/{projectid}/{projectname}/{moduleid}")]
        public IHttpActionResult DeleteFlow(string projectid, string projectname, string moduleid, [FromBody]ModelflowDTO objmodelflow)
        {
            try
            {
                return Ok(DeleteModelFlow(projectid, projectname, moduleid, objmodelflow));
            }
            catch (Exception ex)
            {
                return BadRequest("Error occured...!!");
            }
        }

        [HttpPut]
        [Route("RenameModelFlowDetail/{projectid}/{moduleid}/{modelflowname}/{newname}")]
        public IHttpActionResult RenameModelFlow(string projectid, string moduleid, string newname, string modelflowname)
        {
            try
            {
                return Ok(RenameModelFlowDetail(projectid, moduleid, newname, modelflowname));
            }
            catch (Exception ex)
            {
                return BadRequest("Error occured...!!");
            }
        }

        [HttpPut]
        [Route("AddResultnData/{projectid}/{moduleid}/{modelflowname}")]
        public IHttpActionResult AddResultnTData(string projectid, string moduleid, string modelflowname, [FromBody]ModelflowDTO data)
        {
            try
            {
                return Ok(AddResultnData(projectid, moduleid, modelflowname,data));
            }
            catch (Exception ex)
            {
                return BadRequest("Error occured...!!");
            }
        }

        [HttpGet]
        [Route("GetResultnData/{projectid}/{moduleid}/{modelflowname}")]
        public List<ErnTData> GetResultnTData(string projectid, string moduleid, string modelflowname)
        {
            try
            {
                return GetResultnData(projectid, moduleid, modelflowname);
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    
        [HttpPut]
        [Route("RenameModuleDetail/{projectid}/{newname}")]
        public IHttpActionResult RenameModule(string projectid, string newname, [FromBody]ModelDTO ModelDTO)
        {
            try
            {
                return Ok(RenameModuleDetail(projectid, newname, ModelDTO));
            }
            catch (Exception ex)
            {
                return BadRequest("Error occured...!!");
            }
        }


        [HttpPut]
        [Route("DeleteAllVersions/{projectid}/{moduleid}/{modelFlowname}")]
        public IHttpActionResult DeleteVersions(string projectid, string moduleid, string modelFlowname)
        {
            try
            {
                return Ok(DeleteAllVersions(projectid, moduleid, modelFlowname));
            }
            catch (Exception ex)
            {
                return BadRequest("Error occured...!!");
            }
        }

        // Soft Delete: TestProject/DeleteProjectDetail/5
        [HttpPut]
        [Route("DeleteProjectDetail/{id}")]
        public IHttpActionResult DeleteProject(string id, [FromBody]ProjectDTO objProject)
        {
            try
            {
                return Ok(DeleteProject(id));
            }
            catch (Exception ex)
            {
                return BadRequest("Error occured...!!");
            }
        }

        [HttpPut]
        [Route("RenameProjectDetail/{id}/{newname}")]
        public IHttpActionResult RenameProject(string id, string newname)
        {
            try
            {
                return Ok(RenameProjectDetail(id, newname));
            }
            catch (Exception ex)
            {
                return BadRequest("Error occured...!!");
            }
        }

        // DELETE: TestProject/DeleteProjectDetail/5
        // DELETE: api/TestProject/5
        [HttpDelete]
        [Route("DeleteProjectDetail/{id}")]
        public IHttpActionResult Delete(string id)
        {
            try
            {
                return Ok(DeleteProject(id));
            }
            catch (Exception ex)
            {
                return BadRequest("Error occured...!!");
            }
        }

        [HttpPut]
        [Route("CopyAllWithVersions/{id}/{moduleid}/{flowname}/{copiedfromProject}/{copiedfromModule}/{existsInDB}")]
        public IHttpActionResult CopyWithVersions(string id, string moduleid, string flowname, string copiedfromProject, string copiedfromModule, bool existsInDB)
        {
            try
            {
                return Ok(InsertWithVersions(id, moduleid, flowname, copiedfromProject, copiedfromModule, existsInDB));
            }
            catch (Exception ex)
            {
                return BadRequest("Error occured...!!");
            }
        }

        [HttpGet]
        [Route("getSharedWith/{projectid}/{createdBy}")]
        public IHttpActionResult SharedList(string projectid, string createdBy)
        {
            try
            {
                return Ok(GetSharedList(projectid, createdBy));
            }
            catch (Exception ex)
            {
                return BadRequest("Error occured...!!");
            }
        }

        [HttpPut]
        [Route("RevokeAcess/{projectid}/{psid}")]
        public IHttpActionResult RevokeAcc(string projectid, string psid)
        {
            try
            {
                return Ok(RevokeAccUser(projectid, psid));
            }
            catch (Exception e)
            {
                return BadRequest("Error occured...!!");
            }
        }

        [HttpDelete]
        [Route("DeleteReq/{projectid}/{moduleid}/{modulename}")]
        public IHttpActionResult DelReq(string projectid, string moduleid, string modulename, [FromBody]RequirementsDTO ReqDTO)
        {
            try
            {
                return Ok(DeleteReq(projectid, moduleid, modulename, ReqDTO));
            }
            catch (Exception e)
            {
                return BadRequest("Error occured!");
            }
        }


        [HttpGet]
        [Route("FetchReq/{projectid}/{moduleid}/{modulename}/{reqid}")]
        public IHttpActionResult GetReq(string projectid, string moduleid, string modulename, string reqid)
        {
            try
            {
                return Ok(FetchReq(projectid, moduleid, modulename, reqid));
            }
            catch (Exception e)
            {
                return BadRequest("Error occured!");
            }
        }

        [HttpGet]
        [Route("fetchAutoScripts/{disptext}")]
        public IHttpActionResult fetchAutomatedScripts(string disptext)
        {

            try
            {
                return Ok(getAutomatedScripts(disptext));
            }
            catch (Exception e)
            {
                return BadRequest("Error occured!");
            }
        }

        [HttpGet]
        [Route("getCredentials/{userId}")]
        public UserDetails GetPassword(string userId)
        {
            try
            {
                return getCredentials(userId);
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        [HttpGet]
        [Route("Getdetails/{CompName}")]
        public IHttpActionResult GetCompDetails(string CompName)
        {
            try
            {
                return Ok(GetVdetails(CompName));
            }
            catch (Exception e)
            {
                return BadRequest("Error occured!");
            }
        }

        [HttpGet]
        [Route("GetUsers/{CompName}")]
        public IHttpActionResult GetAllUsers(string CompName)
        {
            try
            {
                return Ok(GetCompUsers(CompName));
            }
            catch (Exception e)
            {
                return BadRequest("Error occured!");
            }
        }

        [HttpPost]
        [Route("UpdateUser/")]
        public IHttpActionResult UpdateUserInfo([FromBody]LoginDetails ld)
        {
            try
            {
                return Ok(UpdateUser(ld));
            }
            catch (Exception e)
            {
                return BadRequest("Error occured!");
            }
        }

        public List<string> GetVendors()
        {
            try
            {
                return getCompanies();
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        private IEnumerable<dynamic> GetProjectCollectionInfo(string id, string createdBy)
        {
            MongoDbOperations _mongosservice = new MongoDbOperations();
            _mongosservice.CollectionName = ApplicationConfig.MongoDBCollections.Projects;
            //createdBy = createdBy.Replace(@"-", @"\");

            //var res = (dynamic)null;           

            IEnumerable<ProjectsWrapper> res = null;

            if (!string.IsNullOrEmpty(id) && !(id.Contains(","))) //&& id != Guid.Empty)
            {
                res = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == id && (item.projectsdetail.createdBy == createdBy || item.projectsdetail.accessList.Contains(createdBy)));
            }
            else if (!string.IsNullOrEmpty(id) && (id.Contains(",")))
            {
                res = _mongosservice.Fetch<ProjectsWrapper>(item => true == true && item.projectsdetail.createdBy == createdBy || item.projectsdetail.accessList.Contains(createdBy)).ToList();
                // string array 
                //string[] strinput = new[] { "e54aa0c8-867d-48e0-8722-095d1ee3ad82", "e54aa0c8-867d-48e0-8722-095d1ee3ad11" };
                //var lststatus = strinput.ToList();
                // string with "," seperated
                string input = id;

                var lststatus = input.Split(',').ToList();
                var reportlst = res.Where(item => lststatus.Contains(item.projectsdetail.projectid)).ToList();

                res = reportlst;
            }
            else
            {
                res = _mongosservice.Fetch<ProjectsWrapper>(item => true == true && item.projectsdetail.createdBy == createdBy || item.projectsdetail.accessList.Contains(createdBy)).ToList();
                //res = _mongosservice.Fetch<ProjectsWrapper>(item => true == true && item.projectsdetail.createdBy == createdBy).ToList();
            }

            //IEnumerable<ProjectsWrapper> res2 = null;
            //res2 = _mongosservice.Fetch<ProjectsWrapper>(item => true == true).ToList();

            //List<ProjectsWrapper> list =res.ToList();

            //foreach (var item in res2)
            //{
            //    foreach (var module in item.projectsdetail.module)
            //    {
            //        var modelflows = module.modelflow;
            //        foreach (var flow in modelflows)
            //        {
            //            if (flow.accessList.IndexOf(createdBy) > -1)
            //            {
            //                if (id == null || id=="")
            //                {
            //                    list.Add(item);
            //                }
            //                else if(id.IndexOf(item.projectsdetail.projectid)>-1)
            //                {
            //                    //List<ModelflowDTO> lstModelflow = new List<ModelflowDTO>();
            //                    //lstModelflow.Add(flow);
            //                    //module.modelflow = lstModelflow;
            //                    list.Add(item);
            //                }
            //            }
            //        }
            //    }
            //}

            //res = list;
            return res;
        }


        private bool InsertProjects(ProjectDTO objProject)
        {
            bool isSuccess = default(bool);
            try
            {
                MongoDbOperations _mongosservice = new MongoDbOperations();
                ProjectsWrapper projectWrapper = new ProjectsWrapper();
                projectWrapper.projectsdetail = objProject;
                //projectWrapper.projectsdetail.createdBy = projectWrapper.projectsdetail.createdBy.Replace(@"-", @"\");

                _mongosservice.CollectionName = ApplicationConfig.MongoDBCollections.Projects;

                _mongosservice.Insert(projectWrapper);

                isSuccess = true;
            }
            catch (Exception ex)
            {
                isSuccess = false;
            }

            return isSuccess;
        }

        private bool InsertProjectCollectionInfo(dynamic inputdata)
        {
            MongoDbOperations _mongosservice = new MongoDbOperations();

            dynamic objinput = JsonConvert.DeserializeObject<ProjectDTO>(inputdata);

            ProjectsWrapper projectWrapper = new ProjectsWrapper();
            projectWrapper.projectsdetail = objinput;
            //projectWrapper.projectsdetail.createdBy = projectWrapper.projectsdetail.createdBy.Replace(@"-", @"\");

            _mongosservice.CollectionName = ApplicationConfig.MongoDBCollections.Projects;

            _mongosservice.Insert(projectWrapper);

            return true;
        }

        private bool UpdateModule(string id, ModelDTO ModelDTO)
        {
            bool isSuccess = default(bool);
            MongoDbOperations _mongosservice = new MongoDbOperations();
            _mongosservice.CollectionName = ApplicationConfig.MongoDBCollections.Projects;


            ProjectsWrapper objProject = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == id).ToList().FirstOrDefault();

            ProjectsWrapper projectWrapper = new ProjectsWrapper();
            projectWrapper.projectsdetail = objProject.projectsdetail;
            //projectWrapper.projectsdetail.createdBy = projectWrapper.projectsdetail.createdBy.Replace(@"-", @"\");

            List<ModelDTO> lstModule = new List<ModelDTO>();
            if (projectWrapper.projectsdetail.module != null && projectWrapper.projectsdetail.module.Count > 0)
            {
                lstModule = projectWrapper.projectsdetail.module;
            }
            lstModule.Add(ModelDTO);
            projectWrapper.projectsdetail.module = lstModule;

            if (ModelDTO != null)
            {
                _mongosservice.UpdateOne<ProjectsWrapper>(item => item.projectsdetail.projectid == id,
                new KeyValue(ApplicationConstants.ProjectConstants.PROJ_DEATAILS_PROJECTVM, projectWrapper.projectsdetail));

                isSuccess = true;
            }

            return isSuccess;
        }


        private bool UpdateModelflow(string projectid, string moduleid, string modulename, ModelflowDTO objModelflow, bool publishAsVersion)
        {
            bool isSuccess = default(bool);
            MongoDbOperations _mongosservice = new MongoDbOperations();
            _mongosservice.CollectionName = ApplicationConfig.MongoDBCollections.Projects;

            var res = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid).ToList();
            ProjectsWrapper objProject = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid).ToList().FirstOrDefault();

            ProjectsWrapper projectWrapper = new ProjectsWrapper();
            projectWrapper.projectsdetail = objProject.projectsdetail;
            //projectWrapper.projectsdetail.createdBy = projectWrapper.projectsdetail.createdBy.Replace(@"-", @"\");


            List<ModelDTO> objmodules = res.SelectMany(d => d.projectsdetail.module).ToList();
            ModelDTO objmodule = objmodules.Where(item => item.moduleid == moduleid).ToList().FirstOrDefault();


            var objMF = objmodule.modelflow != null && objmodule.modelflow.Count > 0 ? objmodule.modelflow.Where(item => item.modelflowid == objModelflow.modelflowid).ToList() : null;

            if (publishAsVersion == true)
            {

                if (objMF != null && objMF.Count > 0)
                {
                    //string maxversion = objmodules.Where(item => item.name == modulename).ToList().FirstOrDefault().modelflow.Max(item => item.version).ToString();
                    var objMF2 = objmodule.modelflow != null && objmodule.modelflow.Count > 0 ? objmodule.modelflow.Where(item => item.modelflowname == objModelflow.modelflowname).ToList() : null;
                    string maxversion = objMF2.Max(item => item.version).ToString();
                    objModelflow.parentFlowid = objModelflow.modelflowid;
                    objModelflow.modelflowid = Convert.ToString(Guid.NewGuid());
                    objModelflow.version = !string.IsNullOrEmpty(maxversion) ? Convert.ToString(Convert.ToInt32(maxversion) + 1) : "1";

                    #region  For New Module version with existing and new modelflow 

                    //ModelDTO objmodulenewversion = objmodule;
                    //objmodulenewversion.version = !string.IsNullOrEmpty(objmodule.version) ? Convert.ToString(Convert.ToInt32(objmodule.version) + 1) : "1";
                    //objmodulenewversion.moduleid = Convert.ToString(Guid.NewGuid());

                    //objmodulenewversion.modelflow.ToList().ForEach(item => item.modelflowid = Convert.ToString(Guid.NewGuid()));

                    //string maxversion = objmodules.Where(item => item.name == modulename).ToList().FirstOrDefault().modelflow.Max(item => item.version).ToString();
                    //objModelflow.version = !string.IsNullOrEmpty(maxversion) ? Convert.ToString(Convert.ToInt32(maxversion) + 1) : "1";


                    //List<ModelflowDTO> lstModelflow = new List<ModelflowDTO>();
                    //objmodulenewversion.modelflow.Add(objModelflow);

                    //projectWrapper.projectsdetail.module.Add(objmodulenewversion);
                    #endregion

                }
            }
            //else
            //{
            //    objmodules.Remove(objmodule);
            //    List<ModelflowDTO> lstModelflow = new List<ModelflowDTO>();
            //    if (objmodule.modelflow != null && objmodule.modelflow.Count > 0)
            //    {
            //        lstModelflow = objmodule.modelflow;
            //    }
            //    lstModelflow.Add(objModelflow);

            //    objmodule.modelflow = lstModelflow;
            //    objmodules.Add(objmodule);
            //    projectWrapper.projectsdetail.module = objmodules;
            //}

            objmodules.Remove(objmodule);
            List<ModelflowDTO> lstModelflow = new List<ModelflowDTO>();
            if (objmodule.modelflow != null && objmodule.modelflow.Count > 0)
            {
                lstModelflow = objmodule.modelflow;
            }
            if (objMF != null && objMF.Count > 0 && !publishAsVersion)
            {
                objModelflow.parentFlowid = objMF[0].parentFlowid;
                objModelflow.ExpectedResultTdata = objMF[0].ExpectedResultTdata;
                lstModelflow.Remove(objMF[0]);
            }
            lstModelflow.Add(objModelflow);

            //lstModelflow = 
            objmodule.modelflow = lstModelflow.OrderBy(x => x.version).ToList();
            objmodules.Add(objmodule);
            projectWrapper.projectsdetail.module = objmodules;


            if (objModelflow != null)
            {
                _mongosservice.UpdateOne<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid,
                   new KeyValue(ApplicationConstants.ProjectConstants.PROJ_DEATAILS_PROJECTVM, projectWrapper.projectsdetail));

                isSuccess = true;
            }

            //ModelDTO objmodules = objProject.SelectMany(d => d.projectsdetail.module).Where(i => i.moduleid == moduleid).FirstOrDefault();
            //List<ModelflowDTO> list = new List<ModelflowDTO>();
            //list.Add(objModelflow);
            //objmodules.modelflow = list;

            //ModelflowDTO objmodelflow = modules.SelectMany(d => d.modelflow).Where(i => i.modelflowid == objModelflow.modelflowid).FirstOrDefault();

            //if (res != null && res.Count > 0)
            //{
            //    _mongosservice.UpdateOne<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid,
            //   new KeyValue(ApplicationConstants.ProjectConstants.PROJ_DEATAILS_MODELVM, objmodules));

            //    isSuccess = true;
            //}

            return isSuccess;
        }

        private bool UpdateReq(string projectid, string moduleid, string modulename, RequirementsDTO objreq, bool publishAsVersion)
        {
            bool isSuccess = default(bool);
            MongoDbOperations _mongosservice = new MongoDbOperations();
            _mongosservice.CollectionName = ApplicationConfig.MongoDBCollections.Projects;

            var res = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid).ToList();
            ProjectsWrapper objProject = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid).ToList().FirstOrDefault();

            ProjectsWrapper projectWrapper = new ProjectsWrapper();
            projectWrapper.projectsdetail = objProject.projectsdetail;
            //projectWrapper.projectsdetail.createdBy = projectWrapper.projectsdetail.createdBy.Replace(@"-", @"\");


            List<ModelDTO> objmodules = res.SelectMany(d => d.projectsdetail.module).ToList();
            ModelDTO objmodule = objmodules.Where(item => item.moduleid == moduleid).ToList().FirstOrDefault();


            var objREQ = objmodule.requirements != null && objmodule.requirements.Count > 0 ? objmodule.requirements.Where(item => item.reqid == objreq.reqid).ToList() : null;

            if (publishAsVersion == true)
            {
                if (objREQ != null && objREQ.Count > 0)
                {
                    objreq.reqid = Convert.ToString(Guid.NewGuid());
                }
            }

            objmodules.Remove(objmodule);
            List<RequirementsDTO> lstModelflow = new List<RequirementsDTO>();
            if (objmodule.requirements != null && objmodule.requirements.Count > 0)
            {
                lstModelflow = objmodule.requirements;
            }
            if (objREQ != null && objREQ.Count > 0 && !publishAsVersion)
            {
                lstModelflow.Remove(objREQ[0]);
            }
            lstModelflow.Add(objreq);

            //lstModelflow = 
            objmodule.requirements = lstModelflow.OrderBy(x => x.reqid).ToList();
            objmodules.Add(objmodule);
            projectWrapper.projectsdetail.module = objmodules;


            if (objreq != null)
            {
                _mongosservice.UpdateOne<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid,
                   new KeyValue(ApplicationConstants.ProjectConstants.PROJ_DEATAILS_PROJECTVM, projectWrapper.projectsdetail));

                isSuccess = true;
            }

            return isSuccess;
        }

        private bool UpdateProject(string id, ProjectDTO objflow)
        {
            bool isSuccess = default(bool);
            MongoDbOperations _mongosservice = new MongoDbOperations();
            _mongosservice.CollectionName = ApplicationConfig.MongoDBCollections.Projects;


            var res = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == id).ToList();


            //IEnumerable<ModelDTO> sel = res.Select(i => i.projectsdetail.model).AsEnumerable<List<ModelDTO>>();

            var modules = res.SelectMany(d => d.projectsdetail.module).ToList();

            ModelflowDTO objmodelflow = modules.SelectMany(d => d.modelflow).Where(i => i.modelflowid == objflow.projectid).FirstOrDefault();


            if (res != null && res.Count > 0)
            {
                _mongosservice.UpdateOne<ProjectsWrapper>(item => item.projectsdetail.projectid == id,
               new KeyValue(ApplicationConstants.ProjectConstants.PROJ_DETAILS_MODELFLOWVM, objmodelflow));

                isSuccess = true;
            }
            //else
            //{
            //    isSuccess = false;
            //}

            //_mongosservice.UpdateOne<ProjectsWrapper>(item => item.projectsdetail.projectid == Convert.ToString(id),
            //   new KeyValue(ApplicationConstants.ProjectConstants.PROJ_DETAILS_PROJECTID, true));

            //_cosmosservice.UpdateOne<AccountRegistrationWrapper>(item => item.RegistrationDetail.AccountId == RegAccountDTO.AccountId,
            //   new KeyValue(ApplicationConstants.Common.REG_DETAILS_REGSTEPLOOKUPID, registrationStep));

            //_cosmosservice.UpdateOne<AccountRegistrationWrapper>(item => item.RegistrationDetail.AccountId == RegAccountDTO.AccountId,
            //      new KeyValue(ApplicationConstants.Common.REG_DETAILS_SYSSITEINFOVM, SystemSiteInfoVM));
            //_cosmosservice.UpdateOne<AccountRegistrationWrapper>(item => item.RegistrationDetail.AccountId == RegAccountDTO.AccountId,
            //   new KeyValue(ApplicationConstants.Common.REG_DEATAILS_ISSITE_FRM_EDITED, true));
            //_cosmosservice.UpdateOne<AccountRegistrationWrapper>(item => item.RegistrationDetail.AccountId == RegAccountDTO.AccountId,
            //   new KeyValue(ApplicationConstants.Common.REG_DETAILS_REGSTEPLOOKUPID, registrationStep));
            return isSuccess;
        }



        private object DeleteProject(string id)
        {
            MongoDbOperations _mongosservice = new MongoDbOperations();
            _mongosservice.CollectionName = ApplicationConfig.MongoDBCollections.Projects;

            ProjectsWrapper ProjectVM = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == id).ToList().FirstOrDefault();

            _mongosservice.DeleteMany<ProjectsWrapper>(item => item.projectsdetail.projectid == id);

            //_mongosservice.DeleteOne<ProjectsWrapper>(item => item.projectsdetail.projectid == id);

            //_mongosservice.DeleteOneById<ProjectsWrapper>(id);

            return null;
        }

        private object RenameProjectDetail(string id, string newname)
        {
            bool isSuccess = default(bool);
            MongoDbOperations _mongosservice = new MongoDbOperations();
            _mongosservice.CollectionName = ApplicationConfig.MongoDBCollections.Projects;

            var res = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == id).ToList();
            ProjectsWrapper objProject = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == id).ToList().FirstOrDefault();

            ProjectsWrapper projectWrapper = new ProjectsWrapper();
            projectWrapper.projectsdetail = objProject.projectsdetail;
            projectWrapper.projectsdetail.name = newname;
            //projectWrapper.projectsdetail.createdBy = projectWrapper.projectsdetail.createdBy.Replace(@"-", @"\");


            if (newname != null)
            {
                _mongosservice.UpdateOne<ProjectsWrapper>(item => item.projectsdetail.projectid == id,
                   new KeyValue(ApplicationConstants.ProjectConstants.PROJ_DEATAILS_PROJECTVM, projectWrapper.projectsdetail));

                isSuccess = true;
            }
            return isSuccess;
        }

        private bool DeleteModule(string id, ModelDTO ModelDTO)
        {
            bool isSuccess = default(bool);
            MongoDbOperations _mongosservice = new MongoDbOperations();
            _mongosservice.CollectionName = ApplicationConfig.MongoDBCollections.Projects;


            ProjectsWrapper objProject = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == id).ToList().FirstOrDefault();

            ProjectsWrapper projectWrapper = new ProjectsWrapper();
            projectWrapper.projectsdetail = objProject.projectsdetail;
            //projectWrapper.projectsdetail.createdBy = projectWrapper.projectsdetail.createdBy.Replace(@"-", @"\");

            List<ModelDTO> lstModule = new List<ModelDTO>();
            if (projectWrapper.projectsdetail.module != null && projectWrapper.projectsdetail.module.Count > 0)
            {
                lstModule = projectWrapper.projectsdetail.module;
            }
            //lstModule.Remove(ModelDTO);
            lstModule.Remove(lstModule.Single(s => s.moduleid == ModelDTO.moduleid));
            projectWrapper.projectsdetail.module = lstModule;

            if (ModelDTO != null)
            {
                _mongosservice.UpdateOne<ProjectsWrapper>(item => item.projectsdetail.projectid == id,
                new KeyValue(ApplicationConstants.ProjectConstants.PROJ_DEATAILS_PROJECTVM, projectWrapper.projectsdetail));

                isSuccess = true;
            }

            return isSuccess;
        }


        private bool DeleteModelFlow(string projectid, string moduleid, string modulename, ModelflowDTO objModelflow)
        {
            bool isSuccess = default(bool);
            MongoDbOperations _mongosservice = new MongoDbOperations();
            _mongosservice.CollectionName = ApplicationConfig.MongoDBCollections.Projects;

            var res = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid).ToList();
            ProjectsWrapper objProject = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid).ToList().FirstOrDefault();

            ProjectsWrapper projectWrapper = new ProjectsWrapper();
            projectWrapper.projectsdetail = objProject.projectsdetail;
            //projectWrapper.projectsdetail.createdBy = projectWrapper.projectsdetail.createdBy.Replace(@"-", @"\");


            List<ModelDTO> objmodules = res.SelectMany(d => d.projectsdetail.module).ToList();
            ModelDTO objmodule = objmodules.Where(item => item.moduleid == moduleid).ToList().FirstOrDefault();


            var objMF = objmodule.modelflow != null && objmodule.modelflow.Count > 0 ? objmodule.modelflow.Where(item => item.modelflowid == objModelflow.modelflowid).ToList() : null;



            if (objMF != null && objMF.Count > 0)
            {
                string maxversion = objMF.Max(item => item.version).ToString();
                objModelflow.modelflowid = Convert.ToString(Guid.NewGuid());
                objModelflow.version = !string.IsNullOrEmpty(maxversion) ? Convert.ToString(Convert.ToInt32(maxversion) + 1) : "1";

            }

            objmodules.Remove(objmodule);
            List<ModelflowDTO> lstModelflow = new List<ModelflowDTO>();
            if (objmodule.modelflow != null && objmodule.modelflow.Count > 0)
            {
                lstModelflow = objmodule.modelflow;
            }
            if (objMF != null && objMF.Count > 0)
            {
                lstModelflow.Remove(objMF[0]);
            }
            //lstModelflow.Add(objModelflow);

            objmodule.modelflow = lstModelflow.OrderBy(x => x.version).ToList();
            objmodules.Add(objmodule);
            projectWrapper.projectsdetail.module = objmodules;


            if (objModelflow != null)
            {
                _mongosservice.UpdateOne<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid,
                   new KeyValue(ApplicationConstants.ProjectConstants.PROJ_DEATAILS_PROJECTVM, projectWrapper.projectsdetail));

                isSuccess = true;
            }
            return isSuccess;
        }

        private bool RenameModelFlowDetail(string projectid, string moduleid, string newName, string modelflowname)
        {
            bool isSuccess = default(bool);
            MongoDbOperations _mongosservice = new MongoDbOperations();
            _mongosservice.CollectionName = ApplicationConfig.MongoDBCollections.Projects;

            var res = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid).ToList();
            ProjectsWrapper objProject = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid).ToList().FirstOrDefault();

            ProjectsWrapper projectWrapper = new ProjectsWrapper();
            projectWrapper.projectsdetail = objProject.projectsdetail;
            //projectWrapper.projectsdetail.createdBy = projectWrapper.projectsdetail.createdBy.Replace(@"-", @"\");


            List<ModelDTO> objmodules = res.SelectMany(d => d.projectsdetail.module).ToList();
            ModelDTO objmodule = objmodules.Where(item => item.moduleid == moduleid).ToList().FirstOrDefault();


            var objMF = objmodule.modelflow != null && objmodule.modelflow.Count > 0 ? objmodule.modelflow.Where(item => item.modelflowname == modelflowname).ToList() : null;

            objmodules.Remove(objmodule);
            List<ModelflowDTO> lstModelflow = new List<ModelflowDTO>();
            if (objmodule.modelflow != null && objmodule.modelflow.Count > 0)
            {
                lstModelflow = objmodule.modelflow;
            }
            if (objMF != null && objMF.Count > 0)
            {
                for (int i = 0; i < objMF.Count; i++)
                {
                    objMF[i].modelflowname = newName;
                }
            }
            //lstModelflow.Add(objModelflow);

            objmodule.modelflow = lstModelflow.OrderBy(x => x.version).ToList();
            objmodules.Add(objmodule);
            projectWrapper.projectsdetail.module = objmodules;


            if (modelflowname != null)
            {
                _mongosservice.UpdateOne<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid,
                   new KeyValue(ApplicationConstants.ProjectConstants.PROJ_DEATAILS_PROJECTVM, projectWrapper.projectsdetail));

                isSuccess = true;
            }
            return isSuccess;
        }

        private bool AddResultnData(string projectid, string moduleid, string modelflowname,[FromBody] ModelflowDTO data)
        {
            bool isSuccess = default(bool);
            MongoDbOperations _mongosservice = new MongoDbOperations();
            _mongosservice.CollectionName = ApplicationConfig.MongoDBCollections.Projects;

            var res = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid).ToList();
            ProjectsWrapper objProject = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid).ToList().FirstOrDefault();

            ProjectsWrapper projectWrapper = new ProjectsWrapper();
            projectWrapper.projectsdetail = objProject.projectsdetail;
            //projectWrapper.projectsdetail.createdBy = projectWrapper.projectsdetail.createdBy.Replace(@"-", @"\");


            List<ModelDTO> objmodules = res.SelectMany(d => d.projectsdetail.module).ToList();
            ModelDTO objmodule = objmodules.Where(item => item.moduleid == moduleid).ToList().FirstOrDefault();


            var objMF = objmodule.modelflow != null && objmodule.modelflow.Count > 0 ? objmodule.modelflow.Where(item => item.modelflowname == modelflowname).ToList() : null;

            objmodules.Remove(objmodule);
            List<ModelflowDTO> lstModelflow = new List<ModelflowDTO>();
            if (objmodule.modelflow != null && objmodule.modelflow.Count > 0)
            {
                lstModelflow = objmodule.modelflow;
            }
            if (objMF != null && objMF.Count > 0)
            {
                for (int i = 0; i < objMF.Count; i++)
                {
                    objMF[i].ExpectedResultTdata = data.ExpectedResultTdata;
                }
            }
            //lstModelflow.Add(objModelflow);

            objmodule.modelflow = lstModelflow.OrderBy(x => x.version).ToList();
            objmodules.Add(objmodule);
            projectWrapper.projectsdetail.module = objmodules;


            if (modelflowname != null)
            {
                _mongosservice.UpdateOne<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid,
                   new KeyValue(ApplicationConstants.ProjectConstants.PROJ_DEATAILS_PROJECTVM, projectWrapper.projectsdetail));

                isSuccess = true;
            }
            return isSuccess;
        }

        private List<ErnTData> GetResultnData(string projectid, string moduleid, string modelflowname)
        {

            bool isSuccess = default(bool);
            MongoDbOperations _mongosservice = new MongoDbOperations();
            _mongosservice.CollectionName = ApplicationConfig.MongoDBCollections.Projects;

            var res = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid).ToList();
            ProjectsWrapper objProject = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid).ToList().FirstOrDefault();

            ProjectsWrapper projectWrapper = new ProjectsWrapper();
            projectWrapper.projectsdetail = objProject.projectsdetail;
            //projectWrapper.projectsdetail.createdBy = projectWrapper.projectsdetail.createdBy.Replace(@"-", @"\");


            List<ModelDTO> objmodules = res.SelectMany(d => d.projectsdetail.module).ToList();
            ModelDTO objmodule = objmodules.Where(item => item.moduleid == moduleid).ToList().FirstOrDefault();


            var objMF = objmodule.modelflow != null && objmodule.modelflow.Count > 0 ? objmodule.modelflow.Where(item => item.modelflowname == modelflowname).ToList() : null;
            return objMF[0].ExpectedResultTdata;
        }
        private bool RenameModuleDetail(string projectid, string newname, ModelDTO ModelDTO)
        {
            bool isSuccess = default(bool);
            MongoDbOperations _mongosservice = new MongoDbOperations();
            _mongosservice.CollectionName = ApplicationConfig.MongoDBCollections.Projects;


            ProjectsWrapper objProject = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid).ToList().FirstOrDefault();

            ProjectsWrapper projectWrapper = new ProjectsWrapper();
            projectWrapper.projectsdetail = objProject.projectsdetail;
            //projectWrapper.projectsdetail.createdBy = projectWrapper.projectsdetail.createdBy.Replace(@"-", @"\");

            List<ModelDTO> lstModule = new List<ModelDTO>();
            if (projectWrapper.projectsdetail.module != null && projectWrapper.projectsdetail.module.Count > 0)
            {
                lstModule = projectWrapper.projectsdetail.module;
            }
            //lstModule.Remove(ModelDTO);
            var list = lstModule.Single(s => s.moduleid == ModelDTO.moduleid);
            list.name = newname;
            projectWrapper.projectsdetail.module = lstModule;

            if (ModelDTO != null)
            {
                _mongosservice.UpdateOne<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid,
                new KeyValue(ApplicationConstants.ProjectConstants.PROJ_DEATAILS_PROJECTVM, projectWrapper.projectsdetail));

                isSuccess = true;
            }

            return isSuccess;
        }


        private bool DeleteAllVersions(string projectid, string moduleid, string flowname)
        {
            bool isSuccess = default(bool);
            MongoDbOperations _mongosservice = new MongoDbOperations();
            _mongosservice.CollectionName = ApplicationConfig.MongoDBCollections.Projects;

            var res = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid).ToList();
            ProjectsWrapper objProject = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid).ToList().FirstOrDefault();

            ProjectsWrapper projectWrapper = new ProjectsWrapper();
            projectWrapper.projectsdetail = objProject.projectsdetail;
            //projectWrapper.projectsdetail.createdBy = projectWrapper.projectsdetail.createdBy.Replace(@"-", @"\");


            List<ModelDTO> objmodules = res.SelectMany(d => d.projectsdetail.module).ToList();
            ModelDTO objmodule = objmodules.Where(item => item.moduleid == moduleid).ToList().FirstOrDefault();


            var objMF = objmodule.modelflow != null && objmodule.modelflow.Count > 0 ? objmodule.modelflow.Where(item => item.modelflowname == flowname).ToList() : null;


            objmodules.Remove(objmodule);
            List<ModelflowDTO> lstModelflow = new List<ModelflowDTO>();
            if (objmodule.modelflow != null && objmodule.modelflow.Count > 0)
            {
                lstModelflow = objmodule.modelflow;
            }
            if (objMF != null && objMF.Count > 0)
            {
                for (int i = 0; i < objMF.Count; i++)
                {
                    lstModelflow.Remove(objMF[i]);
                }
            }
            //lstModelflow.Add(objModelflow);

            objmodule.modelflow = lstModelflow.OrderBy(x => x.version).ToList();
            objmodules.Add(objmodule);
            projectWrapper.projectsdetail.module = objmodules;


            if (flowname != null)
            {
                _mongosservice.UpdateOne<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid,
                   new KeyValue(ApplicationConstants.ProjectConstants.PROJ_DEATAILS_PROJECTVM, projectWrapper.projectsdetail));

                isSuccess = true;
            }
            return isSuccess;
        }

        private bool DeleteReq(string projectid, string moduleid, string modulename, RequirementsDTO ReqDTO)
        {
            bool isSuccess = default(bool);
            MongoDbOperations _mongosservice = new MongoDbOperations();
            _mongosservice.CollectionName = ApplicationConfig.MongoDBCollections.Projects;

            var res = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid).ToList();
            ProjectsWrapper objProject = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid).ToList().FirstOrDefault();

            ProjectsWrapper projectWrapper = new ProjectsWrapper();
            projectWrapper.projectsdetail = objProject.projectsdetail;
            //projectWrapper.projectsdetail.createdBy = projectWrapper.projectsdetail.createdBy.Replace(@"-", @"\");


            List<ModelDTO> objmodules = res.SelectMany(d => d.projectsdetail.module).ToList();
            ModelDTO objmodule = objmodules.Where(item => item.moduleid == moduleid).ToList().FirstOrDefault();


            var objRQ = objmodule.requirements != null && objmodule.requirements.Count > 0 ? objmodule.requirements.Where(item => item.reqid == ReqDTO.reqid).ToList() : null;


            objmodules.Remove(objmodule);
            List<RequirementsDTO> lstModelflow = new List<RequirementsDTO>();
            if (objmodule.modelflow != null && objmodule.modelflow.Count > 0)
            {
                lstModelflow = objmodule.requirements;
            }
            if (objRQ != null && objRQ.Count > 0)
            {
                lstModelflow.Remove(objRQ[0]);
            }
            //lstModelflow.Add(objModelflow);

            objmodule.requirements = lstModelflow.OrderBy(x => x.reqid).ToList();
            objmodules.Add(objmodule);
            projectWrapper.projectsdetail.module = objmodules;


            if (ReqDTO != null)
            {
                _mongosservice.UpdateOne<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid,
                   new KeyValue(ApplicationConstants.ProjectConstants.PROJ_DEATAILS_PROJECTVM, projectWrapper.projectsdetail));

                isSuccess = true;
            }
            return isSuccess;
        }

        private bool InsertWithVersions(string id, string moduleid, string flowname, string copiedfromProject, string copiedfromModule, bool existsInDB)
        {
            bool isSuccess = default(bool);
            MongoDbOperations _mongosservice = new MongoDbOperations();
            _mongosservice.CollectionName = ApplicationConfig.MongoDBCollections.Projects;

            var res1 = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == copiedfromProject).ToList();
            ProjectsWrapper objProject1 = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == copiedfromProject).ToList().FirstOrDefault();

            var res = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == id).ToList();
            ProjectsWrapper objProject = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == id).ToList().FirstOrDefault();

            ProjectsWrapper projectWrapper1 = new ProjectsWrapper();
            projectWrapper1.projectsdetail = objProject1.projectsdetail;
            //projectWrapper1.projectsdetail.createdBy = projectWrapper1.projectsdetail.createdBy.Replace(@"-", @"\");

            ProjectsWrapper projectWrapper = new ProjectsWrapper();
            projectWrapper.projectsdetail = objProject.projectsdetail;
            //projectWrapper.projectsdetail.createdBy = projectWrapper.projectsdetail.createdBy.Replace(@"-", @"\");


            List<ModelDTO> objmodules1 = res1.SelectMany(d => d.projectsdetail.module).ToList();
            ModelDTO objmodule1 = objmodules1.Where(item => item.moduleid == copiedfromModule).ToList().FirstOrDefault();

            List<ModelDTO> objmodules = res.SelectMany(d => d.projectsdetail.module).ToList();
            ModelDTO objmodule = objmodules.Where(item => item.moduleid == moduleid).ToList().FirstOrDefault();


            var objMF = objmodule1.modelflow != null && objmodule1.modelflow.Count > 0 ? objmodule1.modelflow.Where(item => item.modelflowname == flowname).ToList() : null;



            if (objMF != null && objMF.Count > 0)
            {
                objmodules.Remove(objmodule);
                List<ModelflowDTO> lstModelflow = new List<ModelflowDTO>();
                if (objmodule.modelflow != null && objmodule.modelflow.Count > 0)
                {
                    lstModelflow = objmodule.modelflow;
                }
                if (objMF != null && objMF.Count > 0)
                {
                    for (int i = 0; i < objMF.Count; i++)
                    {
                        objMF[i].modelflowid = Convert.ToString(Guid.NewGuid());
                        if (existsInDB)
                        {
                            objMF[i].modelflowname = objMF[i].modelflowname + "_Copy";
                        }
                        lstModelflow.Add(objMF[i]);
                    }
                }
                //lstModelflow.Add(objModelflow);

                objmodule.modelflow = lstModelflow.OrderBy(x => x.version).ToList();
                objmodules.Add(objmodule);
                projectWrapper.projectsdetail.module = objmodules;

                _mongosservice.UpdateOne<ProjectsWrapper>(item => item.projectsdetail.projectid == id,
                   new KeyValue(ApplicationConstants.ProjectConstants.PROJ_DEATAILS_PROJECTVM, projectWrapper.projectsdetail));

                isSuccess = true;
            }

            return isSuccess;
        }

        private string ShareFlowWithUser(string userids, string projectid)
        {
            bool isSuccess = default(bool);
            MongoDbOperations _mongosservice = new MongoDbOperations();
            _mongosservice.CollectionName = ApplicationConfig.MongoDBCollections.Projects;

            //userid = userid.Replace(@"-", @"\");
            var res = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid).ToList();

            MongoDbOperations _mongosservice2 = new MongoDbOperations();
            _mongosservice2.CollectionName = "LoginCredentials";

            LoginDetails res3 = null;
            if (res != null && res.Count > 0)
            {
                res3 = _mongosservice2.Fetch<LoginDetails>(item => item.UserId == res[0].projectsdetail.createdBy).FirstOrDefault();
            }

            string[] userid = userids.Split(',');
            string usersSharedWith = "";

            if (userid.Length > 1)
            {
                for (int i = 0; i < userid.Length; i++)
                {
                    LoginDetails res2 = _mongosservice2.Fetch<LoginDetails>(item => item.UserId == userid[i] && item.Status.ToLower()!="inactive").FirstOrDefault();
                    if (res2 != null && res3 != null)
                    {
                        if (res2.Company.ToLower().Equals(res3.Company.ToLower()))
                        {
                            res[0].projectsdetail.accessList = res[0].projectsdetail.accessList + userid[i] + ",";

                            _mongosservice.UpdateOne<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid,
                           new KeyValue(ApplicationConstants.ProjectConstants.PROJ_DEATAILS_PROJECTVM, res[0].projectsdetail));
                            isSuccess = true;
                            usersSharedWith += userid[i] + ",";
                        }

                    }

                }
            }
            return usersSharedWith;
        }

        private string GetSharedList(string id, string createdBy)
        {
            MongoDbOperations _mongosservice = new MongoDbOperations();
            _mongosservice.CollectionName = ApplicationConfig.MongoDBCollections.Projects;
            //createdBy = createdBy.Replace(@"-", @"\");

            //var res = (dynamic)null;           

            IEnumerable<ProjectsWrapper> res = null;
            string accessList = string.Empty;

            if (!string.IsNullOrEmpty(id) && !(id.Contains(","))) //&& id != Guid.Empty)
            {
                res = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == id && (item.projectsdetail.createdBy == createdBy));
                var list = res.ToList();
                if (list.Count > 0)
                    accessList = list[0].projectsdetail.accessList;
            }
            return accessList;
        }

        private bool RevokeAccUser(string projectid, string psid)
        {
            bool isSuccess = default(bool);
            MongoDbOperations _mongosservice = new MongoDbOperations();
            _mongosservice.CollectionName = ApplicationConfig.MongoDBCollections.Projects;

            //psid = psid.Replace(@"-", @"\");

            var res = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid).ToList();
            if (res != null && res.Count > 0)
            {
                string[] usernames = res[0].projectsdetail.accessList.Split(',');
                string newval = string.Empty;
                for (int i = 0; i < usernames.Length; i++)
                {
                    if (usernames[i] != "")
                    {
                        if (usernames[i] != psid)
                        {
                            newval = newval + usernames[i] + ",";
                        }
                    }
                }

                res[0].projectsdetail.accessList = newval;

                _mongosservice.UpdateOne<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid,
               new KeyValue(ApplicationConstants.ProjectConstants.PROJ_DEATAILS_PROJECTVM, res[0].projectsdetail));

                isSuccess = true;
            }
            return isSuccess;
        }

        private IEnumerable<dynamic> FetchReq(string projectid, string moduleid, string modulename, string reqid)
        {
            MongoDbOperations _mongosservice = new MongoDbOperations();
            _mongosservice.CollectionName = ApplicationConfig.MongoDBCollections.Projects;

            var res = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid).ToList();
            ProjectsWrapper objProject = _mongosservice.Fetch<ProjectsWrapper>(item => item.projectsdetail.projectid == projectid).ToList().FirstOrDefault();

            ProjectsWrapper projectWrapper = new ProjectsWrapper();
            projectWrapper.projectsdetail = objProject.projectsdetail;
            //projectWrapper.projectsdetail.createdBy = projectWrapper.projectsdetail.createdBy.Replace(@"-", @"\");


            List<ModelDTO> objmodules = res.SelectMany(d => d.projectsdetail.module).ToList();
            ModelDTO objmodule = objmodules.Where(item => item.moduleid == moduleid).ToList().FirstOrDefault();

            if (reqid != "null" && !(string.IsNullOrEmpty(reqid)))
            {
                var objMF = objmodule.requirements != null && objmodule.requirements.Count > 0 ? objmodule.requirements.Where(item => item.reqid == reqid).ToList() : null;
                return objMF;
            }
            else
            {
                var objMF = objmodule.requirements != null && objmodule.requirements.Count > 0 ? objmodule.requirements.Where(item => true == true).ToList() : null;
                return objMF;
            }
        }

        private UserDetails getCredentials(string userId)
        {
            MongoDbOperations _mongosservice = new MongoDbOperations();
            MongoDbOperations _mongosservice2 = new MongoDbOperations();
            _mongosservice.CollectionName = "LoginCredentials";
            _mongosservice2.CollectionName = "VendorLicenses";

            LoginDetails res = _mongosservice.Fetch<LoginDetails>(item => item.UserId == userId && item.Status == "Active").FirstOrDefault();
            CompLicense compObj = null;
            if (res != null)
                compObj = _mongosservice2.Fetch<CompLicense>(item => item.Company.ToLower() == res.Company.ToLower()).FirstOrDefault();

            UserDetails details = null;
            if (res != null && compObj != null)
            {
                details = new UserDetails();
                details.UserId = res.UserId;
                details.Password = res.Password;
                details.Role = res.Role;
                details.FirstName = res.FirstName;
                details.LastName = res.LastName;
                details.Company = res.Company;
                details.NumberOfUsersPerLicense = compObj.NumberOfUsersPerLicense;
                details.StartDate = compObj.StartDate;
                details.EndDate = compObj.EndDate;
            }
            return details;
        }

        public bool CheckForExisting(string UserId)
        {
            MongoDbOperations _mongosservice = new MongoDbOperations();
            _mongosservice.CollectionName = "LoginCredentials";
            bool exists = false;

            LoginDetails res = _mongosservice.Fetch<LoginDetails>(item => item.UserId == UserId).FirstOrDefault();
            if (res != null)
            {
                exists = true;
            }
            return exists;
        }
        public bool CheckForExistingCompany(string Company)
        {
            MongoDbOperations _mongosservice = new MongoDbOperations();
            _mongosservice.CollectionName = "VendorLicenses";
            bool exists = false;

            CompLicense res = _mongosservice.Fetch<CompLicense>(item => item.Company.ToLower() == Company.ToLower()).FirstOrDefault();
            if (res != null)
            {
                exists = true;
            }
            return exists;
        }


        public void SaveUser(string FirstName, string LastName, string UserId, string Password, string Company, string Role)
        {
            MongoDbOperations _mongosservice = new MongoDbOperations();
            _mongosservice.CollectionName = "LoginCredentials";

            LoginDetails newRec = new LoginDetails();
            newRec.FirstName = FirstName;
            newRec.LastName = LastName;
            newRec.UserId = UserId;
            newRec.Password = Password;
            newRec.Company = Company;
            newRec.Role = Role;
            newRec.Status = "Active";
            //newRec.StartDate = StartDate;
            //newRec.EndDate = EndDate;

            _mongosservice.Insert<LoginDetails>(newRec);
        }

        public void SaveCompany(string Company, string NumberOfUsersPerLicense, string StartDate, string EndDate)
        {
            MongoDbOperations _mongosservice = new MongoDbOperations();
            _mongosservice.CollectionName = "VendorLicenses";

            CompLicense newRec = new CompLicense();
            newRec.Company = Company;
            newRec.NumberOfUsersPerLicense = NumberOfUsersPerLicense;
            newRec.StartDate = StartDate;
            newRec.EndDate = EndDate;

            _mongosservice.Insert<CompLicense>(newRec);
        }

        private List<Script> getAutomatedScripts(string TestStepVal)
        {
            MongoDbOperations _mongosservice = new MongoDbOperations();
            _mongosservice.CollectionName = "autoScripts";

            IEnumerable<ScriptsWrapper> res = _mongosservice.Fetch<ScriptsWrapper>(item => true == true).ToList();
            string[] stepArr = TestStepVal.ToLower().Split(' ');
            List<Script> retval = null;
            foreach (ScriptsWrapper s in res)
            {
                var found = stepArr.Contains(s.keyword.ToLower());
                if (found)
                {
                    retval = s.script;
                    return retval;
                }
            }
            return retval;
        }

        private List<string> getCompanies()
        {
            MongoDbOperations _mongosservice = new MongoDbOperations();
            _mongosservice.CollectionName = "VendorLicenses";
            List<string> comps = new List<string>();
            comps.Add("---Please Select---");

            var compObj = _mongosservice.Fetch<CompLicense>(item => true == true).ToList();
            foreach (CompLicense cmp in compObj)
            {
                if (cmp.Company != "ITCINFOTECH_ADMIN")
                    comps.Add(cmp.Company);
            }
            return comps;
        }

        public CompLicense GetVdetails(string CompName)
        {
            MongoDbOperations _mongosservice = new MongoDbOperations();
            _mongosservice.CollectionName = "VendorLicenses";
            var compObj = _mongosservice.Fetch<CompLicense>(item => item.Company == CompName).FirstOrDefault();
            return compObj;
        }

        public IEnumerable<LoginDetails> GetCompUsers(string CompName)
        {
            MongoDbOperations _mongosservice = new MongoDbOperations();
            _mongosservice.CollectionName = "LoginCredentials";
            var compObj = _mongosservice.Fetch<LoginDetails>(item => item.Company == CompName).ToList();
            return compObj;
        }

        public void UpdateVendor(string comp, string No, string st, string end)
        {
            MongoDbOperations _mongosservice = new MongoDbOperations();
            _mongosservice.CollectionName = "VendorLicenses";

            //CompLicense res = _mongosservice.Fetch<CompLicense>(item => item.Company == comp).FirstOrDefault();
            KeyValue[] kvpList = { new KeyValue("StartDate", st), new KeyValue("NumberOfUsersPerLicense", No), new KeyValue("EndDate", end) };

            _mongosservice.UpdateCustom<CompLicense>(item => item.Company == comp,
                   kvpList);
        }

        public int getCountOfUsers(string comp)
        {
            MongoDbOperations _mongosservice = new MongoDbOperations();
            _mongosservice.CollectionName = "LoginCredentials";
            int count = _mongosservice.Fetch<LoginDetails>(item => item.Company == comp && item.Status == "Active").Count();
            return count;
        }

        private string UpdateUser(LoginDetails ld)
        {
            string success = "";

            MongoDbOperations _mongosservice = new MongoDbOperations();
            _mongosservice.CollectionName = "LoginCredentials";
            bool update = false;

            if (ld.Status == "Active")
            {
                int count = getCountOfUsers(ld.Company);
                CompLicense comp = GetVdetails(ld.Company);
                if (count < Convert.ToInt32(comp.NumberOfUsersPerLicense))
                {
                    update = true;
                }
                else
                {
                    success = "Maximum number of users are already active for this company.";
                }
            }
            else
            {
                update = true;
            }
            if (update)
            {
                try
                {
                    KeyValue[] kvpList = { new KeyValue("FirstName", ld.FirstName), new KeyValue("LastName", ld.LastName), new KeyValue("Status", ld.Status) };
                    _mongosservice.UpdateCustom<LoginDetails>(item => item.UserId == ld.UserId,
                           kvpList);
                    success = "User Information updated successfully.";
                }
                catch (Exception e)
                {
                    success = "Ooops! Something went wrong.";
                }
            }

            return success;
        }
    }
}
