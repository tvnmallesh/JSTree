@echo off
REM Create a file name for the database output which contains the date and time. Replace any characters which might cause an issue.
set filename=database %date% %time%
set filename=%filename:/=-%
set filename=%filename: =__%
set filename=%filename:.=_%
set filename=%filename::=-%
REM Export the database
echo Running backup "%filename%"
mongodump --out D:\DBBackup\%filename%
REM ZIP the backup directory
ECHO D:\DBBackup\%filename%
powershell.exe -nologo -noprofile -command "& { Add-Type -assembly 'System.IO.Compression.FileSystem'; [IO.Compression.ZipFile]::CreateFromDirectory('D:\DBBackup\%filename%', 'D:\DBBackup\%filename%.zip');}"
REM Delete the backup directory (leave the ZIP file). The /q tag makes sure we don't get prompted for questions 
echo Deleting original backup directory "%filename%"
rmdir "D:\DBBackup\%filename%" /s /q
REM Delete files older than 7 days
forfiles -p "D:\DBBackup\MongoBackups" -s -m *. -d 7 -c "cmd /c del @path"
echo BACKUP COMPLETE

REM to Restore : - mongorestore -d dbname -c collectionName D:\DBBackup\dbfolder\file.bson



