// Görevleri tutmak için bir dizi
let tasks = [];

// DOM elemanlarını seçme
const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');

// Görevleri yerel depolamaya kaydetme
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
//localStorage.clear();

// Görevleri yerel depolamadan yükleme
function loadTasks() {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }
}

// Görevleri listeleme 
function displayTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const taskItem = document.createElement('li');
    taskItem.className = 'taskItem' + (task.completed ? ' completed' : '');

    const span = document.createElement('span');
    span.innerText = (index + 1) + ". " + task.title; // Görevin sıra numarasını ve başlığını birleştirerek ayarlayın
    span.addEventListener('click', () => {
      toggleTask(index);
    });

    if (task.completed) {
      taskItem.classList.add('completed');
    }

    taskItem.appendChild(span);
    taskList.appendChild(taskItem);
  });
}


// Görev ekleme
function addTask(title) {
  return new Promise((resolve, reject) => {
    if (!title) {
      reject('Görev adı boş olamaz!');
      return;
    }

    const newTask = {
      title: title,
      completed: false
    };

    tasks.push(newTask);
    saveTasks();
    resolve(newTask);
  });
}

// Görevi tamamla/düzeltme
function toggleTask(index) {
  return new Promise((resolve, reject) => {
    if (index < 0 || index >= tasks.length) {
      reject('Geçersiz görev indeksi!');
      return;
    }

    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    resolve(tasks[index]);
  })
    .then(updatedTask => {
      const taskItem = taskList.children[index];
      
      if (updatedTask.completed) {
        taskItem.classList.add('completed');
      } else {
        taskItem.classList.remove('completed');
      }
    })
    .catch(error => {
      console.log(error);
    });
}

// Yeni görev ekleme düğmesine tıklama olayı
addButton.addEventListener('click', () => {
  const title = taskInput.value;
  addTask(title)
    .then(() => {
      taskInput.value = '';
      displayTasks();
    })
    .catch(error => {
      alert(error);
    });
});

// Sayfa yüklendiğinde görevleri listeleme
window.addEventListener('load', () => {
  loadTasks();
  displayTasks();
});
