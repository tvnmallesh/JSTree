using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IO;
using TestAPIService.Controllers;
using TestMongoDb.DTOWrappers;
using System.Web.SessionState;
using mbtTool.Models;

namespace mbtTool.Controllers
{
    [SessionState(SessionStateBehavior.Required)]
    public class HomeController : Controller
    {
        public ActionResult Login()
        {
            if (TempData["Message"] != null)
                ViewBag.Message = TempData["Message"];
            return View();
        }

        public ActionResult Index(string UserId, string Password)
        {
            string userId = UserId;
            string pwd = Password;

            if (UserId != null && Password != null)
            {
                ProjectController pj = new ProjectController();

                //string comp = Request.Form["hdnUserId"];

                try
                {

                    UserDetails details = (UserDetails)pj.GetPassword(userId);
                    if (details != null)
                    {
                        if (pwd.Equals(details.Password))
                        {
                            if (details.Role.ToLower() == "designer")
                            {
                                //ViewBag.ClaimsIdentity = details.UserId;
                                Session["ClaimsIdentity"] = details.UserId;
                                Session["Details"] = details;
                                ViewBag.EndDate = details.EndDate;
                                //ViewBag.Fname = details.FirstName;
                                Session["Fname"] = details.FirstName;

                                DateTime date = DateTime.ParseExact(details.EndDate, "dd/MM/yyyy", null);
                                if (Convert.ToDateTime(date) < DateTime.Now)
                                {
                                    ViewBag.Status = "Expired";
                                }
                                else
                                {
                                    ViewBag.Status = "Active";
                                }

                                return View();
                            }
                            else if (details.Role.ToLower() == "admin")
                            {
                                //TempData.Add("Fname", details.FirstName);
                                //TempData.Keep();

                                Session["Details"] = details;
                                return Redirect("~/Home/AddNewUser");
                            }
                        }
                        else
                        {
                            TempData.Add("Message", "Invalid Password!");
                            return Redirect("~/Home/Login");
                        }
                    }
                    else
                    {
                        TempData.Add("Message", "Invalid User Name!");
                        return Redirect("~/Home/Login");
                    }
                }
                catch (Exception e)
                {
                    TempData.Add("Message", "Authentication Failed!");
                    LogException(e);
                    return Redirect("~/Home/Login");
                }
            }
            else if (Session["ClaimsIdentity"] == null)
            {
                TempData.Add("Message", "Session Expired!");
                return Redirect("~/Home/Login");
            }
            return View();
        }

        public ActionResult Logout()
        {
            Session.Clear();
            TempData.Add("Message", "Logged Out Successfully!");
            return Redirect("~/Home/Login");
        }

        public ActionResult SaveUser(AddUserModel usr)
        {
            AddUserModel values = new AddUserModel();
            if (usr.lgninfo != null)
            {
                values.lgninfo = new LoginInfo();
                values.lgninfo.FirstName = usr.lgninfo.FirstName;
                values.lgninfo.LastName = usr.lgninfo.LastName;
                values.lgninfo.UserId = usr.lgninfo.UserId;
                values.lgninfo.Password = usr.lgninfo.Password;
                values.lgninfo.Company = usr.lgninfo.Company;
                values.lgninfo.Role = usr.lgninfo.Role;
            }
            TempData.Add("values", values);
            if (!(string.IsNullOrEmpty(usr.lgninfo.FirstName)) && !(string.IsNullOrEmpty(usr.lgninfo.LastName)) && !(string.IsNullOrEmpty(usr.lgninfo.UserId)) && !(string.IsNullOrEmpty(usr.lgninfo.Password)) && !(string.IsNullOrEmpty(usr.lgninfo.Company)) && usr.lgninfo.Company != "---Please Select---" /*&& !(string.IsNullOrEmpty(Role)) && !(string.IsNullOrEmpty(StartDate)) && !(string.IsNullOrEmpty(EndDate))*/)
            {
                ProjectController pj = new ProjectController();

                try
                {
                    bool exists = pj.CheckForExisting(usr.lgninfo.UserId);
                    
                    if (exists)
                    {
                        TempData.Add("Message", "User With Same User Id exists. Please enter a different User Id.");
                       
                        //values.StartDate = StartDate;
                        //values.EndDate = EndDate;

                        
                    }
                    else
                    {
                        CompLicense cmp =pj.GetVdetails(usr.lgninfo.Company);
                        int count = pj.getCountOfUsers(usr.lgninfo.Company);
                        if (count < Convert.ToInt32(cmp.NumberOfUsersPerLicense))
                        {
                            pj.SaveUser(usr.lgninfo.FirstName, usr.lgninfo.LastName, usr.lgninfo.UserId, usr.lgninfo.Password, usr.lgninfo.Company, usr.lgninfo.Role);
                            TempData.Add("Message", "New User Added successfully.");
                        }
                        else
                        {
                            TempData.Add("Message", "Maximum number of Users have been added. New User cannot be added.");
                        }
                    }
                }
                catch (Exception ex)
                {
                    TempData.Add("Message", "Ooops! Something went wrong. New user could not be added.");
                    LogException(ex);
                }
            }
            else
            {
                TempData.Add("Message", "All the fields are mandatory to add new User! Please Fill all of them.");
            }
            return Redirect("~/Home/AddNewUser");

        }

        public ActionResult SaveCompany(AddUserModel usr)
        {
            if (usr.cmpL != null)
            {
                AddUserModel values = new AddUserModel();
                values.cmpL = new CompLicenses();
                values.cmpL.Company = usr.cmpL.Company;
                values.cmpL.NumberOfUsersPerLicense = usr.cmpL.NumberOfUsersPerLicense;
                values.cmpL.StartDate = usr.cmpL.StartDate;
                values.cmpL.EndDate = usr.cmpL.EndDate;
                TempData.Add("values", values);
            }
            if (!(string.IsNullOrEmpty(usr.cmpL.Company)) && !(string.IsNullOrEmpty(usr.cmpL.StartDate)) && !(string.IsNullOrEmpty(usr.cmpL.EndDate)) && !(string.IsNullOrEmpty(usr.cmpL.NumberOfUsersPerLicense)))
            {
                ProjectController pj = new ProjectController();

                try
                {
                    bool exists = pj.CheckForExistingCompany(usr.cmpL.Company);                    
                    if (exists)
                    {
                        TempData.Add("Message", "Company With Same name exists. Please Add users to Existing company.");                
                    }
                    else
                    {
                        pj.SaveCompany(usr.cmpL.Company, usr.cmpL.NumberOfUsersPerLicense, usr.cmpL.StartDate, usr.cmpL.EndDate);
                        TempData.Add("Message", "New Company Added successfully.");
                    }
                }
                catch (Exception ex)
                {
                    TempData.Add("Message", "Ooops! Something went wrong. Company could not be created.");
                    LogException(ex);
                }
            }
            else
            {
                TempData.Add("Message", "All the fields are mandatory to add new Company! Please Fill all of them.");
            }
            return Redirect("~/Home/AddNewUser");

        }

        public string getURL()
        {
            string url = System.Configuration.ConfigurationManager.AppSettings["ApiUrl"];
            return url;
        }

        public ActionResult AddNewUser()
        {
            AddUserModel lst = null;

            if (TempData["values"] != null)
            {
               lst = (AddUserModel)TempData["values"];               
            }

            if (TempData["Message"] != null)
                ViewBag.Message = TempData["Message"];

            ProjectController pj = new ProjectController();
            List<string> comps = pj.GetVendors();
            SelectList Companies = new SelectList(comps);
            ViewData["Companies"] = Companies;
            //if (TempData["Fname"] != null)
            //    ViewBag.FirstName = TempData["Fname"];
            return View(lst);
        }

        public ActionResult RenewCompany(AddUserModel usr)
        {
            if (usr.cmpL != null)
            {
                AddUserModel values = new AddUserModel();
                values.cmpL = new CompLicenses();
                values.cmpL.Company = usr.cmpL.Company;
                values.cmpL.NumberOfUsersPerLicense = usr.cmpL.NumberOfUsersPerLicense;
                values.cmpL.StartDate = usr.cmpL.StartDate;
                values.cmpL.EndDate = usr.cmpL.EndDate;
                TempData.Add("values", values);
            }
            if (!(string.IsNullOrEmpty(usr.cmpL.Company)) && !(string.IsNullOrEmpty(usr.cmpL.StartDate)) && !(string.IsNullOrEmpty(usr.cmpL.EndDate)) && !(string.IsNullOrEmpty(usr.cmpL.NumberOfUsersPerLicense)) && usr.cmpL.Company != "---Please Select---")
            {
                ProjectController pj = new ProjectController();
                try
                {
                    pj.UpdateVendor(usr.cmpL.Company, usr.cmpL.NumberOfUsersPerLicense, usr.cmpL.StartDate, usr.cmpL.EndDate);
                    TempData.Add("Message", "License for " + usr.cmpL.Company + " renewed successfully.");
                }
                catch (Exception ex)
                {
                    TempData.Add("Message", "Ooops! Something went wrong. License for company "+ usr.cmpL.Company +" could not be renewed." );
                    LogException(ex);
                }
            }
            else
            {
                TempData.Add("Message", "All the fields are mandatory for License renewal! Please Fill all of them.");
            }
            return Redirect("~/Home/AddNewUser");
        }

        [AllowAnonymous]
        public string CheckSession()
        {
            if (Session["Details"] == null)
            {
                return "false";
            }
            else
            {
                return "true";
            }
        }

        public void LogException(Exception e)
        {
            string path = Server.MapPath("~/log.txt");
            using (StreamWriter w = System.IO.File.AppendText(path))
            {
                w.WriteLine("An Exception occured at " + DateTime.Now + Environment.NewLine + e + Environment.NewLine);
                w.WriteLine("-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
            }
        }
        //[HttpPost]
        //public void getCredentials()
        //{
        //    ProjectController pj = new ProjectController();
        //    string userId = Request.Form["txtUserName"];
        //    string pwd = Request.Form["txtPassword"];
        //    //string comp = Request.Form["hdnUserId"];
        //    var password = pj.GetPassword(userId);
        //    if (password.ToString() == pwd)
        //    {
        //        Index(userId);
        //    }

        //}
    }
}