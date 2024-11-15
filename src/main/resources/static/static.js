function createTable(users) {

    const tableBody = document.getElementById('user-table-body');
    tableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.username}</td>
            <td>${user.roles.map(role => role.roleName).join(', ')}</td>
            <td>
                <button type="button" class="btn bg-info text-white edit-button" data-id="${user.id}">
                    Edit
                </button>
            </td>
            <td>
                <button type="button" class="btn bg-danger text-white delete-button" data-id="${user.id}">
                    Delete
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function () {
            const userId = this.getAttribute('data-id');
            openEditModal(userId);
        });
    });
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', function () {
            const userId = this.getAttribute('data-id');
            openDeleteModal(userId);
        });
    });
}

function loadUsers() {
    fetch('/admin/rest/')
        .then(response => response.json())
        .then(users => {
            createTable(users);
        })
        .catch(error => {
            console.error('Ошибка при получении данных:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    loadCurrentUser();
});

function updateUsers() {
    loadUsers();
}

async function loadCurrentUser() {
    try {
        const response = await fetch('/user/rest/');
        if (!response.ok) {
            throw new Error('Ошибка при получении данных пользователя');
        }
        const currentUser = await response.json();

        document.getElementById('user-info').textContent = `${currentUser.email} with roles: ${currentUser.roles.map(role => role.roleName).join(', ')}`;

        createCurrentUserTable(currentUser);
    } catch (error) {
        console.error('Произошла ошибка:', error);
    }
}
function createCurrentUserTable(user) {
    const tableBody = document.getElementById('current-user-table-body');

    tableBody.innerHTML = '';

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.username}</td>
        <td>${user.roles.map(role => role.roleName).join(', ')}</td>
    `;

    tableBody.appendChild(row);
}

document.addEventListener('DOMContentLoaded', () => {
    loadCurrentUser();
});


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('userForm').addEventListener('submit', async function (event) {
        event.preventDefault();


        const user = {
            id: document.getElementById('userId').value,
            name: document.getElementById('setUserName').value,
            username: document.getElementById('setUserUsername').value,
            email: document.getElementById('setUserEmail').value,
            password: document.getElementById('setUserPassword').value,
            roles: [
                {
                    roleName: document.getElementById('setUserRole').value
                }
            ]
        };

        try {
            const response = await fetch('/admin/rest/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            if (response.ok) {
                const result = await response.json();

                const targetTab = document.querySelector('#home-tab');
                const bootstrapTab = new bootstrap.Tab(targetTab);

                document.getElementById('userId').value = '';
                document.getElementById('setUserName').value = '';
                document.getElementById('setUserUsername').value = '';
                document.getElementById('setUserEmail').value = '';
                document.getElementById('setUserPassword').value = '';
                document.getElementById('setUserRole').value = 'USER';

                updateUsers();
                bootstrapTab.show();
            } else {
                throw new Error('Ошибка при добавлении пользователя');
            }
        } catch (error) {
            console.error('Произошла ошибка:', error);
            alert('Ошибка при добавлении пользователя. Проверьте данные и повторите попытку.');
        }
    });
});




async function openDeleteModal(userId) {
    try {
        const response = await fetch(`/admin/rest/${userId}`);
        const user = await response.json();

        document.getElementById('deleteUserId').value = user.id;
        document.getElementById('deleteUserIdReadOnly').value = user.id;
        document.getElementById('deleteUserName').value = user.name;
        document.getElementById('deleteUserUsername').value = user.username;
        document.getElementById('deleteUserEmail').value = user.email;
        document.getElementById('deleteUserPassword').value = user.password;
        document.getElementById('deleteUserRole').value = user.roles[0].roleName;

        $('#deleteUserModal').modal('show');
    } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
    }
}
document.getElementById('deleteUserForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const Id = document.getElementById('deleteUserId').value;

    try {
        const response = await fetch(`/admin/rest/delete/${Id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            $('#deleteUserModal').modal('hide');
            const targetTab = document.querySelector('#home-tab');
            const bootstrapTab = new bootstrap.Tab(targetTab);
            updateUsers();
            bootstrapTab.show();
        } else {
            throw new Error('Ошибка при обновлении пользователя');
        }
    } catch (error) {
        console.error('Ошибка при обновлении пользователя:', error);
        alert('Произошла ошибка. Попробуйте снова.');
    }
});




async function openEditModal(userId) {
    try {
        const response = await fetch(`/admin/rest/${userId}`);
        const user = await response.json();

        document.getElementById('editUserId').value = user.id;
        document.getElementById('editUserIdReadOnly').value = user.id;
        document.getElementById('editUserName').value = user.name;
        document.getElementById('editUserUsername').value = user.username;
        document.getElementById('editUserEmail').value = user.email;
        document.getElementById('editUserHiddenPassword').value = user.password;
        document.getElementById('editUserRole').value = user.roles[0].roleName;

        $('#editUserModal').modal('show');
    } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
    }
}
document.getElementById('editUserForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Предотвращаем стандартное поведение формы

    const updatedUser = {
        id: document.getElementById('editUserId').value,
        name: document.getElementById('editUserName').value,
        username: document.getElementById('editUserUsername').value,
        email: document.getElementById('editUserEmail').value,
        password: document.getElementById('editUserPassword').value,
        roles: [{
            roleName: document.getElementById('editUserRole').value
        }]
    };

    try {
        const response = await fetch(`/admin/rest/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
        });

        if (response.ok) {
            $('#editUserModal').modal('hide');
            updateUsers();
        } else {
            throw new Error('Ошибка при обновлении пользователя');
        }
    } catch (error) {
        console.error('Ошибка при обновлении пользователя:', error);
        alert('Произошла ошибка. Попробуйте снова.');
    }
});

async function loadCurrentUser() {
    try {
        const response = await fetch('/user/rest/');
        if (!response.ok) {
            throw new Error('Ошибка при получении данных пользователя');
        }
        const currentUser = await response.json();
        document.getElementById('user-info').textContent = `${currentUser.email} with roles: ${currentUser.roles.map(role => role.roleName).join(', ')}`;

        createCurrentUserTable(currentUser);
    } catch (error) {
        console.error('Произошла ошибка:', error);
    }
}

function createCurrentUserTable(user) {
    const tableBody = document.getElementById('current-user-table-body');

    tableBody.innerHTML = '';

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.username}</td>
        <td>${user.roles.map(role => role.roleName).join(', ')}</td>
    `;
    tableBody.appendChild(row);
}
document.addEventListener('DOMContentLoaded', () => {
    loadCurrentUser();
});