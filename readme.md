Core Concept

- jo meri disk hoti h vo dumb blob store 
- Iski identity db me store kra lege
- Internal path , path never exposed

Object = {
   Bucket,
   Key ,
   metadata,
   data (binary data)
}


/blob-store
 - a9/
     - 12312312.blob
 - f3 
    - mohit.blob


bucket
key
blobId
size
mimeType
metadata  :{ owner : "user1"}

key = /users/mohit/a.png
storage = same

Key , Bucket = logical storage

blobId , diskPath = physical storage


/bucket/key

bucket , key , expiry - access Url

