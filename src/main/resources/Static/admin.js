//Table
const renderUsers = async (users1) => {
    const response = await fetch("/api/admin");

    if (response.ok) {
        let json = await response.json()
            .then(data => fuckedFunction(data));
    } else {
        alert("Ошибка HTTP: " + response.status);
    }

    function fuckedFunction(users) {
        let output = ''
        users.forEach(user => {
            output += ` 
              <tr> 
                    <td>${user.id}</td> 
                    <td>${user.name}</td> 
                    <td>${user.email}</td> 
                    <td>${user.username}</td>
                    <td>${user.roles.map(role => role.name === 'ROLE_USER' ? 'USER' : 'ADMIN')}</td> 
              <td> 
                   <button type="button" class="btn btn-info" id="update-user" data-action="update" 
                    data-id="${user.id}" data-toggle="modal" data-target="modal" data-userid="${user.id}" >Update</button> 
               </td> 
               <td> 
                   <button type="button" class="btn btn-danger" id="delete-user" data-action="delete" 
                   data-id="${user.id}" data-target="modal">Delete</button> 
                    </td> 
              </tr>`
        })
        info.innerHTML = output;
    }
}
let users = [];
const updateUser = (user) => {
    const foundIndex = users.findIndex(x => x.id === user.id);
    users[foundIndex] = user;
    renderUsers(users);
    console.log('users');
}
const removeUser = (id) => {
    users = users.filter(user => user.id !== id);
    console.log(users)
    renderUsers(users);
}

// GET ALL users
const info = document.querySelector('#allUsers');
const url = 'http://localhost:8080/api/admin'

fetch(url, {mode: 'cors'})
    .then(res => res.json())
    .then(data => {
        users = data;
        renderUsers(data)
    })

// ADD user

const addUserForm = document.querySelector('#addUser')
const addName = document.getElementById('addName')
const addEmail = document.getElementById('addEmail')
const addUsername = document.getElementById('addUsername')
const addPassword = document.getElementById('addPassword')
const addRoles = document.getElementById('addRoles')
console.log(addRoles)

addUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const addForm = document.getElementById("addForm");
    const formData = new FormData(addForm);
    const object = {
        roles: []
    };

    formData.forEach((value, key) => {
        if (key === "nameRoles") {

            const roleId = value.split("_")[0];
            const roleName = value.split("_")[1];
            const role = {
                id: roleId,
                name: "ROLE_" + roleName
            };
            object.roles.push(role);
        } else {
            object[key] = value;
        }
    });


    fetch("/api/admin", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(object)
    })
        .then(res => res.json())
        .then(data => updateUser(data))
        .then(() => addForm.reset())
        .catch((e) => console.error(e))

    return show('users_table', 'addUser');

})

const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e)
        }
    })
}


// Update user
on(document, 'click', '#update-user', e => {
    const userInfo = e.target.parentNode.parentNode
    document.getElementById('updateId').value = userInfo.children[0].innerHTML
    document.getElementById('updateName').value = userInfo.children[1].innerHTML
    document.getElementById('updateEmail').value = userInfo.children[2].innerHTML
    document.getElementById('updateUsername').value = userInfo.children[3].innerHTML
    document.getElementById('updatePassword').value = userInfo.children[4].innerHTML
    document.getElementById('updateRoles').value = userInfo.children[5].innerHTML


    $("#modalUpdate").modal("show")
})

const updateUserForm = document.querySelector('#modalUpdate')
updateUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(document.getElementById('formUpdate'));
    const object = {
        roles: []
    };

    formData.forEach((value, key) => {
        if (key === "nameRoles") {

            const roleId = value.split("_")[0];
            const roleName = value.split("_")[1];
            const role = {
                id: roleId,
                name: "ROLE_" + roleName
            };
            object.roles.push(role);
        } else {
            object[key] = value;
        }
    });


    fetch("/api/admin/" + document.getElementById('updateId').value, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(object)
    })
        .then(res => res.json()).then(data => updateUser(data))
        .catch((e) => console.error(e))

    $("#modalUpdate").modal("hide")
})

// DELETE user
let currentUserId = null;
const deleteUserForm = document.querySelector('#modalDelete')
deleteUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    fetch('http://localhost:8080/api/admin/' + currentUserId, {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(data => {
            removeUser(currentUserId);
            deleteUserForm.removeEventListener('submit', () => {
            });
            $("#modalDelete").modal("hide")
        })
})

on(document, 'click', '#delete-user', e => {
    const fila2 = e.target.parentNode.parentNode
    currentUserId = fila2.children[0].innerHTML

    document.getElementById('deleteId').value = fila2.children[0].innerHTML
    document.getElementById('deleteName').value = fila2.children[1].innerHTML
    document.getElementById('deleteEmail').value = fila2.children[2].innerHTML
    document.getElementById('deleteUsername').value = fila2.children[3].innerHTML
    document.getElementById('deleteRoles').value = fila2.children[4].innerHTML

    $("#modalDelete").modal("show")
})