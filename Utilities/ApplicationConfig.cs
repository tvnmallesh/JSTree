using System;
using System.Collections.Generic;
using System.Configuration;

namespace Utilities
{
    /// <summary>
    /// Super class to access all application related config data of various functionalities
    /// </summary>
    public static class ApplicationConfig
    {

        /// <summary>
        /// class is used to access config data to work with NO SQL DB
        /// </summary>
        public static class NoSQLParameters
        {
            private static string _host;
            private static string _password;
            private static string _userName;
            private static string _databaseName;

            public static string Host => _host;
            public static string Password => _password;
            public static string UserName => _userName;
            public static string DatabaseName => _databaseName;

            static NoSQLParameters()
            {
                _host = ConfigurationManager.AppSettings["MongoDb:Host"];
                _databaseName = ConfigurationManager.AppSettings["MongoDb:DatabaseName"];

                //_host = ConfigurationManager.AppSettings["MongoDb:Host"];
                //_databaseName = ConfigurationManager.AppSettings["MongoDb:DatabaseName"];
                //_userName = ConfigurationManager.AppSettings["MongoDb:UserName"];
                ////set MongoDb password value
                //if (KeyVaultKeys != null && KeyVaultKeys.ContainsKey(ApplicationConstants.Common.KV_MONGODB_PASSWORD))
                //{
                //    _password = KeyVaultKeys[ApplicationConstants.Common.KV_MONGODB_PASSWORD];
                //}


            }
        }


        /// <summary>
        /// Static Class to access different collections in Cosmos DB.
        /// </summary>
        public static class MongoDBCollections
        {
            private static string _projects;
            private static string _userActivities;
            private static string _auditActivities;

            /// <summary>
            /// get Cosmos DB Registrations collection Name
            /// </summary>
            /// <returns></returns>
            public static string Projects => _projects;

            /// <summary>
            /// get Cosmos DB UserActivities collection Name
            /// </summary>
            /// <returns></returns>
            public static string UserActivities => _userActivities;

            public static string AuditActivities => _auditActivities;

            static MongoDBCollections()
            {

                _projects = ConfigurationManager.AppSettings["Mongos:Collections:Projects"];
                _userActivities = ConfigurationManager.AppSettings["Mongos:Collections:UserActivities"];
                _auditActivities = ConfigurationManager.AppSettings["Mongos:Collections:AuditActivities"];
            }
        }

        /// <summary>
        /// Used for to access API Urls
        /// </summary>
        public static class WebAppUrlConfig
        {
            private static string _userInfoUrl;
            public static string UserInfoUrl => _userInfoUrl;

            static WebAppUrlConfig()
            {
                _userInfoUrl = ConfigurationManager.AppSettings["WebApiUrls:UserInfoUrl"];
            }
        }

        public static class EnableCors
        {
            private static string _origins;
            public static string Origins => _origins;

            static EnableCors()
            {
                _origins = ConfigurationManager.AppSettings["EnableCors:Origins"];
            }
        }

        /// <summary>
        /// Used for to access Web/API Links
        /// </summary>
        public static class AppLinks
        {
            private static string _homeUrl;
            private static string _helpUrl;
            private static string _serviceDeskUrl;
            private static string _faqUrl;
            private static string _privacyPolicyUrl;
            private static string _termsOfUseUrl;
            private static string _disclaimerUrl;
            private static string _copyrightUrl;
            private static string _registrantDetailsUrl;
            private static string _contactUs;

            public static string HomeUrl => _homeUrl;
            public static string HelpUrl => _helpUrl;
            public static string ServiceDeskUrl => _serviceDeskUrl;
            public static string FAQUrl => _faqUrl;
            public static string PrivacyPolicyUrl => _privacyPolicyUrl;
            public static string TermsOfUseUrl => _termsOfUseUrl;
            public static string DisclaimerUrl => _disclaimerUrl;
            public static string CopyrightUrl => _copyrightUrl;
            public static string ContactUs => _contactUs;
            public static string RegistrantDetailsUrl => _registrantDetailsUrl;

            static AppLinks()
            {
                _homeUrl = ConfigurationManager.AppSettings["AppLinks:Home"];
                _helpUrl = ConfigurationManager.AppSettings["AppLinks:Help"];
                _serviceDeskUrl = ConfigurationManager.AppSettings["AppLinks:ServiceDesk"];
                _faqUrl = ConfigurationManager.AppSettings["AppLinks:FAQ"];
                _privacyPolicyUrl = ConfigurationManager.AppSettings["AppLinks:PrivacyPolicy"];
                _termsOfUseUrl = ConfigurationManager.AppSettings["AppLinks:TermsOfUse"];
                _disclaimerUrl = ConfigurationManager.AppSettings["AppLinks:Disclaimer"];
                _copyrightUrl = ConfigurationManager.AppSettings["AppLinks:Copyright"];
                _registrantDetailsUrl = ConfigurationManager.AppSettings["AppLinks:RegistrantDetails"];
                _contactUs = ConfigurationManager.AppSettings["AppLinks:ContactUs"];
            }
        }


        #region Commented code
        /// <summary>
        /// Class is used to access config data to work with blob storage
        /// </summary>
        //public static class Blobs
        //{
        //    private static string _connectionString;
        //    private static string _imagePath;
        //    private static string _cameraimagesContainer;

        //    public static string ConnectionString => _connectionString;
        //    public static string ImagePath => _imagePath;
        //    public static string CameraImagesContainer => _cameraimagesContainer;

        //    static Blobs()
        //    {
        //        //set Blob ConnectionString value
        //        if (KeyVaultKeys != null && KeyVaultKeys.ContainsKey(ApplicationConstants.Common.KV_BLOB_CONNECTION_STRING))
        //        {
        //            _connectionString = KeyVaultKeys[ApplicationConstants.Common.KV_BLOB_CONNECTION_STRING];
        //        }
        //        _imagePath = ConfigurationManager.AppSettings["Blob:ImagePath"];
        //        _cameraimagesContainer = ConfigurationManager.AppSettings["Blob:CameraImagesContainer"];
        //    }
        //}

        /// <summary>
        /// class is used to access config data to work with logging
        /// </summary>
        //public static class LogEnabled
        //{
        //    private static bool _error;
        //    private static bool _warning;
        //    private static bool _information;
        //    private static bool _critical;

        //    public static bool Error => _error;
        //    public static bool Warning => _warning;
        //    public static bool Information => _information;
        //    public static bool Critical => _critical;

        //    static LogEnabled()
        //    {
        //        _error = isTurnedOn("LogEnabled.Error");
        //        _warning = isTurnedOn("LogEnabled.Warning");
        //        _information = isTurnedOn("LogEnabled.Information");
        //        _critical = isTurnedOn("LogEnabled.Critical");
        //    }

        //    private static bool isTurnedOn(string setting)
        //    {
        //        // List of values that can indicate whether a feature is disabled
        //        List<string> disableIndicators = new List<string> { "off", "disabled", "disable", "no", "false", "0" };

        //        var logEnabled = ConfigurationManager.AppSettings[setting];
        //        if (logEnabled != null && disableIndicators.Contains(logEnabled.ToLower()))
        //        {
        //            return false;
        //        }
        //        return true;
        //    }
        //}

        /// <summary>
        /// class is used to access required config data to work with Azure ADB2C
        /// </summary>
        //public static class AADB2C
        //{
        //    public const int NEW_USER = 0;
        //    public const int CAN_CREATE_ACCOUNT = 1;
        //    public const int GREATER_THAN_HUNDRED_ACCOUNTS = 2;


        //    private static string _clientId;
        //    private static string _clientSecret;
        //    private static string _tenant;

        //    private static string _aadInstance;
        //    private static string _signUpPolicyId;
        //    private static string _signInPolicyId;
        //    private static string _userProfilePolicyId;
        //    private static string _redirectUri;
        //    private static string _loginUri;

        //    private static string _claimsUri;

        //    public static string Tenant => _tenant;
        //    public static string ClientId => _clientId;
        //    public static string ClientSecret => _clientSecret;


        //    public static string AadInstance => _aadInstance;
        //    public static string SignUpPolicyId => _signUpPolicyId;
        //    public static string SignInPolicyId => _signInPolicyId;
        //    public static string UserProfilePolicyId => _userProfilePolicyId;
        //    public static string RedirectUri => _redirectUri;
        //    public static string LoginUri => _loginUri;
        //    public static string ClaimsUri => _claimsUri;

        //    static AADB2C()
        //    {
        //        _tenant = ConfigurationManager.AppSettings["AADB2C:Tenant"];
        //        _clientId = ConfigurationManager.AppSettings["AADB2C:ClientId"];
        //        _clientSecret = ConfigurationManager.AppSettings["AADB2C:ClientSecret"];

        //        _aadInstance = ConfigurationManager.AppSettings["AADB2C:AadInstance"];
        //        _signUpPolicyId = ConfigurationManager.AppSettings["AADB2C:SignUpPolicyId"];
        //        _signInPolicyId = ConfigurationManager.AppSettings["AADB2C:SignInPolicyId"];
        //        _userProfilePolicyId = ConfigurationManager.AppSettings["AADB2C:UserProfilePolicyId"];
        //        _redirectUri = ConfigurationManager.AppSettings["AADB2C:RedirectUri"];
        //        _loginUri = ConfigurationManager.AppSettings["AADB2C:LoginUri"];

        //        _claimsUri = ConfigurationManager.AppSettings["AADB2C:ClaimsUri"];
        //    }

        //}

        /// <summary>
        /// class is used to access required config data to work with Primary database
        /// </summary>
        //public static class PrimaryDatabase
        //{
        //    private static string _connectionString;

        //    public static string ConnectionString => _connectionString;
        //    public static string _replaceConnectionString;
        //    static PrimaryDatabase()
        //    {
        //        string _replaceConnectionString = ConfigurationManager.ConnectionStrings["CCTVREntities"].ConnectionString;
        //        if (KeyVaultKeys != null && KeyVaultKeys.ContainsKey(ApplicationConstants.Common.KV_PRIMARY_DB_CONNECTION_STRING))
        //        {
        //            string primDatabaseConnectstringSecretUriValue = KeyVaultKeys[ApplicationConstants.Common.KV_PRIMARY_DB_CONNECTION_STRING];
        //            //set Priamry Database ConnectionString value
        //            _connectionString = string.Format(_replaceConnectionString, primDatabaseConnectstringSecretUriValue);
        //            _replaceConnectionString = ConfigurationManager.ConnectionStrings["CCTVREntities"].ConnectionString;
        //        }
        //    }
        //}

        /// <summary>
        /// class is used to access required config data to work with Secondary database
        /// </summary>
        //public static class SecondaryDatabase
        //{
        //    private static string _connectionString;

        //    public static string ConnectionString => _connectionString;
        //    public static string _replaceConnectionString;

        //    static SecondaryDatabase()
        //    {
        //        string _replaceConnectionString = ConfigurationManager.ConnectionStrings["CCTVRReadEntities"].ConnectionString;
        //        if (KeyVaultKeys != null && KeyVaultKeys.ContainsKey(ApplicationConstants.Common.KV_SECONDARY_DB_CONNECTION_STRING))
        //        {
        //            string primDatabaseConnectstringSecretUriValue = KeyVaultKeys[ApplicationConstants.Common.KV_SECONDARY_DB_CONNECTION_STRING];
        //            //set Secondary Database ConnectionString value
        //            _connectionString = string.Format(_replaceConnectionString, primDatabaseConnectstringSecretUriValue);
        //            _replaceConnectionString = ConfigurationManager.ConnectionStrings["CCTVRReadEntities"].ConnectionString;
        //        }
        //    }

        //}

        /// <summary>
        /// SendGrid Classto access to access required grid related config data while sending email in Azure cloud
        /// </summary>
        //public static class SendGrid
        //{
        //    private static string _apiKey;
        //    private static string _fromEmail;
        //    private static string _toEmail;
        //    /// <summary>
        //    /// get SendGrid API key
        //    /// </summary>
        //    /// <returns></returns>
        //    public static string APIKey => _apiKey;
        //    public static string FromEmail => _fromEmail;
        //    public static string ToEmail => _toEmail;

        //    static SendGrid()
        //    {
        //        if (KeyVaultKeys != null && KeyVaultKeys.ContainsKey(ApplicationConstants.Common.KV_SENDGRID_API_KEY))
        //        {
        //            //set SendGrid API Key
        //            _apiKey = KeyVaultKeys[ApplicationConstants.Common.KV_SENDGRID_API_KEY];
        //        }
        //        _fromEmail = ConfigurationManager.AppSettings["SendGrid:FromEmail"];
        //        _toEmail = ConfigurationManager.AppSettings["SendGrid:ToEmail"];
        //    }
        //}

        //public static class VesrionInfo
        //{
        //    private static string _version;

        //    private static string _releaseDate;

        //    public static string Version => _version;

        //    public static string RelasedDate => _releaseDate;

        //    static VesrionInfo()
        //    {
        //        _version = ConfigurationManager.AppSettings["webpages:Version"];
        //        _releaseDate = ConfigurationManager.AppSettings["webpages:VersionDate"];
        //    }
        //}


        //public static class JSKeysProperties
        //{
        //    private static string _webApiUri;

        //    private static string _googleMapsAPIKey;

        //    private static string _googleRecaptchaAPIKey;

        //    private static string _imagePath;

        //    private static string _reportUri;

        //    private static string _staticMapUrlKey;

        //    private static string _sessionTimeout;

        //    private static string _gMapCenterLat;

        //    private static string _gMapCenterLng;

        //    public static string WebApiUri => _webApiUri;

        //    public static string GoogleMapsAPIKey => _googleMapsAPIKey;

        //    public static string GoogleRecaptchaAPIKey => _googleRecaptchaAPIKey;

        //    public static string ImagePath => _imagePath;

        //    public static string ReportUri => _reportUri;

        //    public static string StaticMapUrlKey => _staticMapUrlKey;

        //    public static string SessionTimout => _sessionTimeout;


        //    public static string GoogleMapCenterLat => _gMapCenterLat;
        //    public static string GoogleMapCenterLng => _gMapCenterLng;

        //    static JSKeysProperties()
        //    {
        //        _webApiUri = ConfigurationManager.AppSettings["JSKeys:WebApiUri"];
        //        _googleMapsAPIKey = ConfigurationManager.AppSettings["JSKeys:GoogleMapsAPIKey"];
        //        _googleRecaptchaAPIKey = ConfigurationManager.AppSettings["JSKeys:GoogleRecaptchaAPIKey"];
        //        _staticMapUrlKey = ConfigurationManager.AppSettings["JSKeys:StaticMapUrl"];
        //        _imagePath = ConfigurationManager.AppSettings["JSKeys:BlobImagePath"];
        //        _sessionTimeout = ConfigurationManager.AppSettings["SessionTimeout"];
        //        _reportUri = ConfigurationManager.AppSettings["JSKeys:ReportUri"];

        //        _gMapCenterLat = ConfigurationManager.AppSettings["JSKeys:GoogleMapCenterLat"];
        //        _gMapCenterLng = ConfigurationManager.AppSettings["JSKeys:GoogleMapCenterLng"];

        //    }
        //}

        //public static class EnableCors
        //{
        //    private static string _origins;
        //    public static string Origins => _origins;

        //    static EnableCors()
        //    {
        //        _origins = ConfigurationManager.AppSettings["EnableCors:Origins"];
        //    }
        //}

        //public static Dictionary<string, string> KeyVaultKeys;

        //public static void KeyVaultInitialize(Dictionary<string, string> keyvaultdata)
        //{
        //    if (KeyVaultKeys != null)
        //    {
        //        // throw new Exception(ApplicationConstants.Common.KEY_VAULT_KEYS_ALREADY_INITIALISED);
        //    }
        //    else
        //    {
        //        KeyVaultKeys = keyvaultdata;
        //    }
        //}

        ///// <summary>
        ///// class is used to access required config data to work with Service Desk Email
        ///// </summary>
        //public static class ServiceDeskEmail
        //{

        //    private static string _email;

        //    public static string Tenant => _email;


        //    static ServiceDeskEmail()
        //    {
        //        _email = ConfigurationManager.AppSettings["ServiceDeskEmail:Email"];
        //    }

        //}
        #endregion
    }
}