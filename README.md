Deskripsi singkat web service
Skema basis data yang digunakan
Endpoint API
(optional) Payload, dan response API
Penjelasan mengenai pembagian tugas masing-masing anggota (lihat formatnya pada bagian pembagian tugas).

# Deskripsi Web Service
Web service digunakan untuk menyediakan layanan login, register, logout, insert dan read konten, read menfess.

# Skema Basis Data
<img width="657" alt="image" src="https://github.com/IF3110-2023-02-17/moi-rest-service/assets/73476678/6164424c-70df-45fd-a4fb-9780f2fefd29">

# Endpoint API
- /posts/
- /posts/:post_id
- /user/
- /user/login
- /user/register
- /user/logout

# Pembagian Tugas Anggota
- Backend fungsi Login : 13521109
- Backend fungsi Register : 13521109
- Backend fungsi Logout : 13521109
- Backend fungsi CRUD konten : 13521171
- Backend fungsi read, accept, reject subscription : 13521067
- Backend fungsi read studios : 13521067

RANDOM STRING IN WIN:

    -join ((48..57) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
