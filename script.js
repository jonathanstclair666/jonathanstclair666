// =============== LIGHTBOX SETTINGS ===============
lightbox.option({
    'resizeDuration': 200,
    'wrapAround': true,
    'alwaysShowNavOnTouchDevices': true
});

// =============== THEME TOGGLE ===============
const toggleSwitch = document.querySelector('.toggle-switch');
const body = document.body;

if(localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    body.classList.remove('dark-mode');
} else {
    body.classList.add('dark-mode');
    body.classList.remove('light-mode');
}

toggleSwitch.addEventListener('click', () => {
    if(body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    }
});

// =============== CATEGORY FILTER ===============
const filterButtons = document.querySelectorAll('.category-btn');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        document.querySelectorAll('.item').forEach(item => {
            if (filterValue === 'all' || item.classList.contains(filterValue)) {
                item.parentElement.style.display = 'block';
            } else {
                item.parentElement.style.display = 'none';
            }
        });
    });
});

// =============== SEARCH FUNCTION ===============
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('keyup', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    document.querySelectorAll('.item').forEach(item => {
        const title = item.getAttribute('alt') || '';
        if (title.toLowerCase().includes(searchTerm)) {
            item.parentElement.style.display = 'block';
        } else {
            item.parentElement.style.display = 'none';
        }
    });
});

// =============== UPLOAD FUNCTION (FIXED!) ===============
const fileInput = document.getElementById('fileInput');
const gallery = document.getElementById('gallery');

fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if(files.length === 0) return;
    
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            addImageToGallery(event.target.result, 'User Upload');
            alert('✅ Image added successfully!');
        };
        
        reader.readAsDataURL(file);
    });
});

// Add image to page
function addImageToGallery(imageData, title) {
    const newItem = document.createElement('div');
    newItem.classList.add('item-wrapper');
    
    const link = document.createElement('a');
    link.href = imageData;
    link.setAttribute('data-lightbox', 'gallery');
    link.setAttribute('data-title', title);
    
    const img = document.createElement('img');
    img.src = imageData;
    img.alt = title;
    img.classList.add('item', 'nature');
    
    link.appendChild(img);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.onclick = function() {
        if(confirm('Delete this photo?')) {
            newItem.remove();
        }
    };
    
    // Add Download Button
    const downloadSection = document.createElement('div');
    downloadSection.classList.add('download-section');
    
    const downloadBtn = document.createElement('a');
    downloadBtn.href = "https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=jonathanstclair666@hotmail.com&currency_code=GBP&amount=5.00&item_name=Download Photo";
    downloadBtn.target = "_blank";
    downloadBtn.classList.add('download-btn');
    downloadBtn.innerHTML = '📥 DOWNLOAD - £5';
    
    downloadSection.appendChild(downloadBtn);
    
    newItem.appendChild(link);
    newItem.appendChild(deleteBtn);
    newItem.appendChild(downloadSection);
    
    gallery.appendChild(newItem);
}

console.log('✅ WEBSITE READY!');
