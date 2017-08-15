using Antlr.Runtime;
using Microsoft.Azure;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;

namespace LoginRegistration.Helpers
{
    public static class BlobStorageHelper
    {
        public class AzureBlobLink
        {
            public string Uri { get; set; }
            public string Name { get; set; }
        }

        public static string GetAttachmentUri(string resourceName, string uri, string storageContainer)
        {
            string storageConnectionString = CloudConfigurationManager.GetSetting("MS_StorageConnectionString");

            var cloudStorageAccount = CloudStorageAccount.Parse(storageConnectionString);
            var cloudBlobClient = cloudStorageAccount.CreateCloudBlobClient();

            var cloudBlobContainer = cloudBlobClient.GetContainerReference(storageContainer);

            var sasPolicy = new SharedAccessBlobPolicy()
            {
                SharedAccessStartTime = DateTime.UtcNow.AddDays(-1),
                SharedAccessExpiryTime = DateTime.MaxValue,
                Permissions = SharedAccessBlobPermissions.Read,
            };

            var cloudBlob = cloudBlobContainer.GetBlockBlobReference(resourceName);
            var sasQuery = cloudBlob.GetSharedAccessSignature(sasPolicy);

            return cloudBlob.Uri + sasQuery;
        }

        public static void DownloadFile(string uri, string filePath)
        {
            using (var webClient = new WebClient())
            {
                webClient.DownloadFile(uri, filePath);
            }
        }

        public static void UploadBlobWithRestAPISasPermissionOnBlobContainer(string blobContainerSasUri, string blobName, byte[] blobContent)
        {
            int contentLength = blobContent.Length;
            string queryString = (new Uri(blobContainerSasUri)).Query;
            string blobContainerUri = blobContainerSasUri.Split('?')[0];
            string requestUri = string.Format(CultureInfo.InvariantCulture, "{0}/{1}{2}", blobContainerUri, blobName, queryString);
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(requestUri);
            request.Method = "PUT";
            request.Headers.Add("x-ms-blob-type", "BlockBlob");
            request.ContentLength = contentLength;
            using (Stream requestStream = request.GetRequestStream())
            {
                requestStream.Write(blobContent, 0, contentLength);
            }
            using (HttpWebResponse resp = (HttpWebResponse)request.GetResponse())
            {

            }
        }
    }
}