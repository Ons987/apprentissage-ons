using LoginRegistration.Models;
using Microsoft.Azure;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Security.Claims;
using System.Web;
using System.Web.Mvc;

namespace LoginRegistration.Controllers
{
    public class UsersController : Controller
    {
        private ApplicationDbContext Context = new ApplicationDbContext();
        private bool IsEmailValid(string emailaddress)
        {
            try
            {
                MailAddress m = new MailAddress(emailaddress);
                return true;
            }
            catch (FormatException)
            {
                return false;
            }
        }




        public ActionResult Edit()
        {

            var profil = User.Identity.Name;
            var account = Context.UserAccounts.FirstOrDefault(x => x.Email == profil);
                          
            
           
            return View(account); ;
        }

        [HttpPost]
        public ActionResult EditProfile(UserAccount model)
        {
            var userId = User.Identity.Name;

            var account = Context.UserAccounts.FirstOrDefault(x => x.Email == userId);
          
            try
            {
                Context.UserAccounts.Attach(account);
                account.FirstName = model.FirstName;
                account.LastName = model.LastName;
                Context.SaveChanges();
            }
            catch (Exception)
            {

            }
            return Json(model, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult UploadPhoto(HttpPostedFileBase file)
        {
            var error = "";
            // UsersWebServces.PostUserPicture();

            byte[] fileData = null;

            using (var binaryReader = new BinaryReader(file.InputStream))
            {
                fileData = binaryReader.ReadBytes(file.ContentLength);
            }
            if (fileData != null)
            {
                var userId = User.Identity.Name;

                var account = Context.UserAccounts.FirstOrDefault(x => x.Email == userId);

                var storageConnectionString = CloudConfigurationManager.GetSetting("MS_StorageConnectionString");

                var cloudStorageAccount = CloudStorageAccount.Parse(storageConnectionString);
                var cloudBlobClient = cloudStorageAccount.CreateCloudBlobClient();

                var storageContainer = CloudConfigurationManager.GetSetting("MB_UserStorageContainer");

                var cloudBlobContainer = cloudBlobClient.GetContainerReference(storageContainer);

                var sasPolicy = new SharedAccessBlobPolicy()
                {
                    SharedAccessStartTime = DateTime.UtcNow.AddHours(-24),
                    SharedAccessExpiryTime = DateTime.UtcNow.AddHours(24),
                    Permissions = SharedAccessBlobPermissions.Write,
                };

                var resourceName = $"{account.UserID}/photo.png";

                var cloudBlob = cloudBlobContainer.GetBlockBlobReference(resourceName);

                var AttachmentUri = $"{cloudStorageAccount.BlobEndpoint}{storageContainer}/{resourceName}";
                var SasQueryString = cloudBlob.GetSharedAccessSignature(sasPolicy);
                var query = AttachmentUri;
                        query = query.Remove(query.LastIndexOf("/"), query.Length - query.LastIndexOf("/"));
                        query = query.Remove(query.LastIndexOf("/"), query.Length - query.LastIndexOf("/"));
               Helpers.BlobStorageHelper.UploadBlobWithRestAPISasPermissionOnBlobContainer(query + SasQueryString, resourceName, fileData);
                Context.UserAccounts.Attach(account);
                account.Photo= Helpers.BlobStorageHelper.GetAttachmentUri(resourceName, AttachmentUri, storageContainer);
                var entry = Context.Entry(account);
                entry.Property(e => e.Photo).IsModified = true;
                Context.SaveChanges();
            }
            

            return Json(new { Result = error });

        }

    }
}