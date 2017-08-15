using LoginRegistration.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Security.Claims;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace LoginRegistration.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
       
      
        public ActionResult Index()
        {
            return View();
                 
        }
       

        /* public ActionResult UploadPhoto(HttpPostedFileBase file)
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
                 UserAttachment userAtt = new UserAttachment();
                 // UsersWebServices.PostUserPicture();
                 var userId = (this.User as ClaimsPrincipal).FindFirst(ClaimTypes.NameIdentifier).Value;

                 var User = Context.UserAccounts.FirstOrDefault(x => x.Email == userId);

                 if (User == null)
                     return Json(new {  Result = false, Message = "User invalide" });

                  userAtt.UserID = User.UserID;

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

                 var resourceName = $"{User.UserID}/{userAtt.UserAttachmentType}.jpg";

                 var cloudBlob = cloudBlobContainer.GetBlockBlobReference(resourceName);

                 var UserAttachmentToEdit =
                     Context.UserAttachement.FirstOrDefault(
                         x =>
                             x.UserID == User.UserID &&
                             x.UserAttachmentType == userAtt.UserAttachmentType);

                 if (UserAttachmentToEdit != null)
                 {


                    Context.UserAttachement.Attach(UserAttachmentToEdit);
                     UserAttachmentToEdit.SasQueryString = cloudBlob.GetSharedAccessSignature(sasPolicy);
                     var attach = Context.Entry(UserAttachmentToEdit);
                     attach.Property(e => e.SasQueryString).IsModified = true;

                     await Context.SaveChangesAsync();

                     if (userAtt.UserAttachmentType == UserAttachmentType.Picture)
                     {
                         Context.UserAccounts.Attach(User);
                         User.Photo= Helpers.BlobStorageHelper.GetAttachmentUri(UserAttachmentToEdit.ResourceName, UserAttachmentToEdit.AttachmentUri, UserBlobContainer);
                         var entry = Context.Entry(User);
                         entry.Property(e => e.Photo).IsModified = true;
                         await Context.SaveChangesAsync();
                     }
                     //var editedUserAttachment = Mapper.Map<UserAttachment, MobileUserAttachment>(UserAttachmentToEdit);

                     return new
                     {
                         UserAttachmentToEdit.Id,
                         UserAttachmentToEdit.ResourceName,
                         UserAttachmentToEdit.SasQueryString,
                         UserAttachmentToEdit.UserID,
                         UserAttachmentToEdit.UserAttachmentType,
                         UserAttachmentToEdit.ContainerName,
                         UserAttachmentToEdit.AttachmentUri
                     });
                 }

                userAtt.ContainerName = storageContainer;
                 userAtt.SasQueryString = cloudBlob.GetSharedAccessSignature(sasPolicy);
                 userAtt.ResourceName = resourceName;
                 userAtt.AttachmentUri = $"{cloudStorageAccount.BlobEndpoint}{userAtt.ContainerName}/{userAtt.ResourceName}";

                 if (userAtt.UserAttachmentType == UserAttachmentType.Picture)
                 {
                     Context.UserAccounts.Attach(User);
                     User.Photo = Helpers.BlobStorageHelper.GetAttachmentUri(userAtt.ResourceName, userAtt.AttachmentUri, UserBlobContainer);
                     var entry = Context.Entry(User);
                     entry.Property(e => e.Photo).IsModified = true;
                     await Context.SaveChanges();
                 }
                 Context.UserAttachments.Add(userAtt);

                 await C);
                 return new
                 {
                     userAtt.Id,
                     userAtt.ResourceName,
                     userAtt.SasQueryString,
                     userAtt.UserID,
                     userAtt.UserAttachmentType,
                     userAtt.ContainerName,
                     userAtt.AttachmentUri
                 });
             }
             error = "";
               //  var attachment = UsersWebServices.GetUserAttachments(out error);
                 if (attachment != null)
                 {
                     var l = attachment.Where(x => x.UserAttachmentType == UserAttachmentType.Picture).FirstOrDefault();
                     if (l != null)
                     {
                         var query = l.AttachmentUri;
                         query = query.Remove(query.LastIndexOf("/"), query.Length - query.LastIndexOf("/"));
                         query = query.Remove(query.LastIndexOf("/"), query.Length - query.LastIndexOf("/"));
                         UsersWebServices.UploadAttachment(query + l.SasQueryString, l.ResourceName, fileData);
                     }
                 }
             }

             return Json(new { Result = error });

         }*/

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}