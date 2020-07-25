using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;


namespace mbtTool.Models
{
    public class Entities
    {
        [Required(ErrorMessage = "Project name cannot be left blank!")]
        public string project
        {
            get;
            set;
        }

        [Required(ErrorMessage = "Module name cannot be left blank!")]
        public string module
        {
            get;
            set;
        }

        [Required(ErrorMessage = "Model Flow name cannot be left blank!")]
        public string modelFlow
        {
            get;
            set;
        }
    }

    public class AddUserModel {
        public LoginInfo lgninfo { get; set; }
        public CompLicenses cmpL { get; set; }
    }

    public class LoginInfo
    {
        [Required(ErrorMessage = "*")]
        public string FirstName
        {
            get;
            set;
        }
        [Required(ErrorMessage = "*")]
        public string LastName
        {
            get;
            set;
        }

        [Required(ErrorMessage = "UserId cannot be left blank!")]
        public string UserId
        {
            get;
            set;
        }
        [Required(ErrorMessage = "Password cannot be left blank!")]
        public string Password
        {
            get;
            set;
        }
        [Required(ErrorMessage = "*")]
        public string Role
        {
            get;
            set;
        }
        [Required(ErrorMessage = "*")]
        public string Company
        {
            get;
            set;
        }
        [Required(ErrorMessage = "*")]
        public string Status
        {
            get;
            set;
        }
    }
    public class CompLicenses
    {
        [Required(ErrorMessage = "*")]
        public string Company
        {
            get;
            set;
        }
        [Required(ErrorMessage = "*")]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:yyyy-MM-dd}")]
        public string StartDate
        {
            get;
            set;
        }
        [Required(ErrorMessage = "*")]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:yyyy-MM-dd}")]
        public string EndDate
        {
            get;
            set;
        }
        [Required(ErrorMessage = "*")]
        public string NumberOfUsersPerLicense
        {
            get;
            set;
        }
    }
}