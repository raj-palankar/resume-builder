document.addEventListener('DOMContentLoaded', function() {
    
    // DOM Elements
    const navBtns = document.querySelectorAll('.nav-btn');
    const homePage = document.getElementById('homePage');
    const builderPage = document.getElementById('builderPage');
    const savedPage = document.getElementById('savedPage');
    const aboutPage = document.getElementById('aboutPage');
    const themeToggle = document.getElementById('themeToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const goToBuilderBtn = document.getElementById('goToBuilderBtn');
    const goToSavedBtn = document.getElementById('goToSavedBtn');
    const saveResumeBtn = document.getElementById('saveResumeBtn');
    const downloadBtn = document.getElementById('downloadPDFBtn');
    const templateSelect = document.getElementById('templateSelect');
    const accentColorPicker = document.getElementById('accentColor');
    const previewDiv = document.getElementById('resumePreview');
    const toast = document.getElementById('toast');
    
    // Form Elements
    const fullName = document.getElementById('fullName');
    const gender = document.getElementById('gender');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const skills = document.getElementById('skills');
    const strengths = document.getElementById('strengths');
    const education = document.getElementById('education');
    const experience = document.getElementById('experience');
    const projects = document.getElementById('projects');
    const certifications = document.getElementById('certifications');
    const languages = document.getElementById('languages');
    const awards = document.getElementById('awards');
    const hobbies = document.getElementById('hobbies');
    const references = document.getElementById('references');
    const linkedin = document.getElementById('linkedin');
    const github = document.getElementById('github');
    const profilePhoto = document.getElementById('profilePhoto');
    const signatureName = document.getElementById('signatureName');
    
    let currentPhotoPreview = null;
    let currentSignatureData = null;
    
    // Toast Function
    function showToast(message) {
        if (!toast) return;
        toast.innerHTML = '✅ ' + message;
        toast.classList.add('show');
        setTimeout(function() {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // Escape HTML
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    
    // Signature HTML Generator
    function getSignatureHTML(data) {
        if (!data.signature && !data.signatureName) return '';
        return `
            <div class="resume-signature">
                <div class="signature-rectangle-box">
                    ${data.signature ? '<img src="' + data.signature + '" class="signature-image" alt="Signature">' : '<div style="height:60px; text-align:center; line-height:60px; color:var(--text-secondary);">✍️ Sign here</div>'}
                </div>
                <div class="signature-name-below">${escapeHtml(data.signatureName || '__________________')}</div>
                <div class="signature-line"></div>
                <div class="signature-label">Digital Signature</div>
            </div>
        `;
    }
    
    // Signature Canvas Setup
    const canvas = document.getElementById('signatureCanvas');
    let ctx = null;
    let drawing = false;
    
    if (canvas) {
        ctx = canvas.getContext('2d');
        
        function clearCanvasBackground() {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#7c3aed';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
        }
        clearCanvasBackground();
        
        function getMousePos(canvas, evt) {
            const rect = canvas.getBoundingClientRect();
            let clientX, clientY;
            if (evt.type.includes('touch')) {
                if (evt.touches.length === 0) return { x: 0, y: 0 };
                clientX = evt.touches[0].clientX;
                clientY = evt.touches[0].clientY;
            } else {
                clientX = evt.clientX;
                clientY = evt.clientY;
            }
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            let x = (clientX - rect.left) * scaleX;
            let y = (clientY - rect.top) * scaleY;
            x = Math.min(Math.max(x, 0), canvas.width);
            y = Math.min(Math.max(y, 0), canvas.height);
            return { x: x, y: y };
        }
        
        function startDrawing(e) {
            drawing = true;
            const pos = getMousePos(canvas, e);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            e.preventDefault();
        }
        
        function draw(e) {
            if (!drawing) return;
            e.preventDefault();
            const pos = getMousePos(canvas, e);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        }
        
        function stopDrawing() {
            drawing = false;
            ctx.beginPath();
        }
        
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseleave', stopDrawing);
        canvas.addEventListener('touchstart', startDrawing);
        canvas.addEventListener('touchmove', draw);
        canvas.addEventListener('touchend', stopDrawing);
        
        // Clear Button
        const clearBtn = document.getElementById('clearSignatureBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                clearCanvasBackground();
                currentSignatureData = null;
                generatePreview();
                showToast('Signature cleared');
            });
        }
        
        // Save Button
        const saveSigBtn = document.getElementById('saveSignatureBtn');
        if (saveSigBtn) {
            saveSigBtn.addEventListener('click', function() {
                currentSignatureData = canvas.toDataURL('image/png');
                generatePreview();
                showToast('Signature saved');
            });
        }
        
        // Upload Button
        const uploadInput = document.getElementById('uploadSignature');
        if (uploadInput) {
            uploadInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        const img = new Image();
                        img.onload = function() {
                            clearCanvasBackground();
                            const ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
                            const width = img.width * ratio;
                            const height = img.height * ratio;
                            const x = (canvas.width - width) / 2;
                            const y = (canvas.height - height) / 2;
                            ctx.drawImage(img, x, y, width, height);
                            currentSignatureData = canvas.toDataURL('image/png');
                            generatePreview();
                            showToast('Signature uploaded');
                        };
                        img.src = event.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }
    
    // Navigation System
    function showPage(pageId) {
        if (homePage) homePage.classList.remove('active');
        if (builderPage) builderPage.classList.remove('active');
        if (savedPage) savedPage.classList.remove('active');
        if (aboutPage) aboutPage.classList.remove('active');
        
        if (pageId === 'home' && homePage) homePage.classList.add('active');
        if (pageId === 'builder' && builderPage) builderPage.classList.add('active');
        if (pageId === 'saved' && savedPage) savedPage.classList.add('active');
        if (pageId === 'about' && aboutPage) aboutPage.classList.add('active');
        
        navBtns.forEach(function(btn) {
            btn.classList.remove('active');
            if (btn.getAttribute('data-page') === pageId) {
                btn.classList.add('active');
            }
        });
        
        if (pageId === 'saved') {
            loadSavedResumes();
        }
    }
    
    navBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var page = this.getAttribute('data-page');
            showPage(page);
            if (navLinks) navLinks.classList.remove('active');
        });
    });
    
    if (goToBuilderBtn) {
        goToBuilderBtn.addEventListener('click', function() { showPage('builder'); });
    }
    if (goToSavedBtn) {
        goToSavedBtn.addEventListener('click', function() { showPage('saved'); });
    }
    
    // Theme Toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            var isDark = document.body.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                themeToggle.innerHTML = '🌙';
                showToast('Light mode activated');
            } else {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeToggle.innerHTML = '☀️';
                showToast('Dark mode activated');
            }
        });
    }
    
    var savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        if (themeToggle) themeToggle.innerHTML = '☀️';
    }
    
    // Accent Color
    if (accentColorPicker) {
        accentColorPicker.addEventListener('input', function(e) {
            var color = e.target.value;
            document.documentElement.style.setProperty('--accent-color', color);
            localStorage.setItem('accentColor', color);
            generatePreview();
        });
    }
    
    var savedAccent = localStorage.getItem('accentColor');
    if (savedAccent && accentColorPicker) {
        document.documentElement.style.setProperty('--accent-color', savedAccent);
        accentColorPicker.value = savedAccent;
    }
    
    // Mobile Menu
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Profile Photo
    if (profilePhoto) {
        profilePhoto.addEventListener('change', function(e) {
            var file = e.target.files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function(event) {
                    currentPhotoPreview = event.target.result;
                    generatePreview();
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Input Listeners
    var allInputs = [fullName, gender, email, phone, skills, strengths, education, experience, projects, certifications, languages, awards, hobbies, references, linkedin, github, signatureName];
    for (var i = 0; i < allInputs.length; i++) {
        var input = allInputs[i];
        if (input) {
            input.addEventListener('input', generatePreview);
            input.addEventListener('change', generatePreview);
        }
    }
    
    if (templateSelect) {
        templateSelect.addEventListener('change', generatePreview);
    }
    
    // Simple Template
    function simpleTemplate(data) {
        var html = '<div style="text-align:center;">';
        if (data.photo) html += '<img src="' + data.photo + '" style="width:100px;height:100px;border-radius:50%;margin-bottom:1rem;">';
        html += '<h2 style="color:var(--accent-color);">' + escapeHtml(data.fullName) + '</h2>';
        if (data.gender) html += '<p>⚥ ' + escapeHtml(data.gender) + '</p>';
        html += '<p>📧 ' + escapeHtml(data.email) + ' | 📞 ' + escapeHtml(data.phone) + '</p>';
        html += '</div>';
        if (data.strengths) html += '<div class="resume-section"><h3>💪 Strengths</h3><p>' + escapeHtml(data.strengths).replace(/\n/g, '<br>') + '</p></div>';
        html += '<div class="resume-section"><h3>💻 Skills</h3><p>' + escapeHtml(data.skills).replace(/\n/g, '<br>') + '</p></div>';
        html += '<div class="resume-section"><h3>🎓 Education</h3><p>' + escapeHtml(data.education).replace(/\n/g, '<br>') + '</p></div>';
        html += '<div class="resume-section"><h3>💼 Experience</h3><p>' + escapeHtml(data.experience).replace(/\n/g, '<br>') + '</p></div>';
        html += '<div class="resume-section"><h3>📁 Projects</h3><p>' + escapeHtml(data.projects).replace(/\n/g, '<br>') + '</p></div>';
        if (data.certifications) html += '<div class="resume-section"><h3>📜 Certifications</h3><p>' + escapeHtml(data.certifications).replace(/\n/g, '<br>') + '</p></div>';
        if (data.languages) html += '<div class="resume-section"><h3>🌐 Languages</h3><p>' + escapeHtml(data.languages).replace(/\n/g, '<br>') + '</p></div>';
        if (data.awards) html += '<div class="resume-section"><h3>🏆 Awards</h3><p>' + escapeHtml(data.awards).replace(/\n/g, '<br>') + '</p></div>';
        if (data.hobbies) html += '<div class="resume-section"><h3>🎨 Hobbies</h3><p>' + escapeHtml(data.hobbies).replace(/\n/g, '<br>') + '</p></div>';
        if (data.references) html += '<div class="resume-section"><h3>👥 References</h3><p>' + escapeHtml(data.references).replace(/\n/g, '<br>') + '</p></div>';
        html += getSignatureHTML(data);
        return html;
    }
    
    // Modern Template
    function modernTemplate(data) {
        var html = '<div>';
        html += '<div style="background:var(--accent-color);color:white;padding:1.5rem;border-radius:12px;margin-bottom:1rem;">';
        if (data.photo) html += '<img src="' + data.photo + '" style="width:100px;height:100px;border-radius:50%;margin-bottom:1rem;">';
        html += '<h2>' + escapeHtml(data.fullName) + '</h2>';
        if (data.gender) html += '<p>⚥ ' + escapeHtml(data.gender) + '</p>';
        html += '<p>📧 ' + escapeHtml(data.email) + '</p>';
        html += '<p>📞 ' + escapeHtml(data.phone) + '</p>';
        if (data.linkedin) html += '<p>🔗 ' + escapeHtml(data.linkedin) + '</p>';
        if (data.github) html += '<p>🐙 ' + escapeHtml(data.github) + '</p>';
        html += '</div>';
        if (data.strengths) html += '<div class="resume-section"><h3>💪 Strengths</h3><p>' + escapeHtml(data.strengths).replace(/\n/g, '<br>') + '</p></div>';
        html += '<div class="resume-section"><h3>💻 Skills</h3><p>' + escapeHtml(data.skills).replace(/\n/g, '<br>') + '</p></div>';
        html += '<div class="resume-section"><h3>🎓 Education</h3><p>' + escapeHtml(data.education).replace(/\n/g, '<br>') + '</p></div>';
        html += '<div class="resume-section"><h3>💼 Experience</h3><p>' + escapeHtml(data.experience).replace(/\n/g, '<br>') + '</p></div>';
        html += '<div class="resume-section"><h3>📁 Projects</h3><p>' + escapeHtml(data.projects).replace(/\n/g, '<br>') + '</p></div>';
        if (data.certifications) html += '<div class="resume-section"><h3>📜 Certifications</h3><p>' + escapeHtml(data.certifications).replace(/\n/g, '<br>') + '</p></div>';
        if (data.languages) html += '<div class="resume-section"><h3>🌐 Languages</h3><p>' + escapeHtml(data.languages).replace(/\n/g, '<br>') + '</p></div>';
        if (data.awards) html += '<div class="resume-section"><h3>🏆 Awards</h3><p>' + escapeHtml(data.awards).replace(/\n/g, '<br>') + '</p></div>';
        if (data.hobbies) html += '<div class="resume-section"><h3>🎨 Hobbies</h3><p>' + escapeHtml(data.hobbies).replace(/\n/g, '<br>') + '</p></div>';
        if (data.references) html += '<div class="resume-section"><h3>👥 References</h3><p>' + escapeHtml(data.references).replace(/\n/g, '<br>') + '</p></div>';
        html += getSignatureHTML(data);
        return html + '</div>';
    }
    
    // Professional Template
    function professionalTemplate(data) {
        var html = '<div style="border-left:4px solid var(--accent-color);padding-left:2rem;">';
        if (data.photo) html += '<img src="' + data.photo + '" style="width:100px;height:100px;border-radius:50%;float:right;">';
        html += '<h2 style="color:var(--accent-color);">' + escapeHtml(data.fullName) + '</h2>';
        if (data.gender) html += '<p>⚥ ' + escapeHtml(data.gender) + '</p>';
        html += '<p>📧 ' + escapeHtml(data.email) + ' | 📞 ' + escapeHtml(data.phone) + '</p>';
        if (data.linkedin) html += '<p>🔗 ' + escapeHtml(data.linkedin) + '</p>';
        if (data.github) html += '<p>🐙 ' + escapeHtml(data.github) + '</p>';
        if (data.strengths) html += '<div class="resume-section"><h3>💪 Strengths</h3><p>' + escapeHtml(data.strengths).replace(/\n/g, '<br>') + '</p></div>';
        html += '<div class="resume-section"><h3>💻 Professional Summary</h3><p>' + escapeHtml(data.skills).replace(/\n/g, '<br>') + '</p></div>';
        html += '<div class="resume-section"><h3>💼 Experience</h3><p>' + escapeHtml(data.experience).replace(/\n/g, '<br>') + '</p></div>';
        html += '<div class="resume-section"><h3>🎓 Education</h3><p>' + escapeHtml(data.education).replace(/\n/g, '<br>') + '</p></div>';
        html += '<div class="resume-section"><h3>📁 Projects</h3><p>' + escapeHtml(data.projects).replace(/\n/g, '<br>') + '</p></div>';
        if (data.certifications) html += '<div class="resume-section"><h3>📜 Certifications</h3><p>' + escapeHtml(data.certifications).replace(/\n/g, '<br>') + '</p></div>';
        if (data.languages) html += '<div class="resume-section"><h3>🌐 Languages</h3><p>' + escapeHtml(data.languages).replace(/\n/g, '<br>') + '</p></div>';
        if (data.awards) html += '<div class="resume-section"><h3>🏆 Awards</h3><p>' + escapeHtml(data.awards).replace(/\n/g, '<br>') + '</p></div>';
        if (data.hobbies) html += '<div class="resume-section"><h3>🎨 Hobbies</h3><p>' + escapeHtml(data.hobbies).replace(/\n/g, '<br>') + '</p></div>';
        if (data.references) html += '<div class="resume-section"><h3>👥 References</h3><p>' + escapeHtml(data.references).replace(/\n/g, '<br>') + '</p></div>';
        html += getSignatureHTML(data);
        return html;
    }
    
    // Generate Preview
    function generatePreview() {
        var template = templateSelect ? templateSelect.value : 'modern';
        var data = {
            fullName: fullName ? fullName.value || 'Your Name' : 'Your Name',
            gender: gender ? gender.value || '' : '',
            email: email ? email.value || 'email@example.com' : 'email@example.com',
            phone: phone ? phone.value || '+1 234 567 8900' : '+1 234 567 8900',
            skills: skills ? skills.value || 'JavaScript, Python, React' : 'JavaScript, Python, React',
            strengths: strengths ? strengths.value || 'Leadership, Communication' : 'Leadership, Communication',
            education: education ? education.value || 'Bachelor Degree' : 'Bachelor Degree',
            experience: experience ? experience.value || 'Work experience' : 'Work experience',
            projects: projects ? projects.value || 'Projects' : 'Projects',
            certifications: certifications ? certifications.value || '' : '',
            languages: languages ? languages.value || '' : '',
            awards: awards ? awards.value || '' : '',
            hobbies: hobbies ? hobbies.value || '' : '',
            references: references ? references.value || '' : '',
            linkedin: linkedin ? linkedin.value || '' : '',
            github: github ? github.value || '' : '',
            photo: currentPhotoPreview,
            signature: currentSignatureData,
            signatureName: signatureName ? signatureName.value || '' : ''
        };
        
        var html = '';
        if (template === 'simple') {
            html = simpleTemplate(data);
        } else if (template === 'professional') {
            html = professionalTemplate(data);
        } else {
            html = modernTemplate(data);
        }
        
        if (previewDiv) {
            previewDiv.innerHTML = html;
        }
    }
    
    // Save Resume
    if (saveResumeBtn) {
        saveResumeBtn.addEventListener('click', function() {
            var resumeData = {
                id: Date.now(),
                full_name: fullName ? fullName.value || '' : '',
                gender: gender ? gender.value || '' : '',
                email: email ? email.value || '' : '',
                phone: phone ? phone.value || '' : '',
                skills: skills ? skills.value || '' : '',
                strengths: strengths ? strengths.value || '' : '',
                education: education ? education.value || '' : '',
                experience: experience ? experience.value || '' : '',
                projects: projects ? projects.value || '' : '',
                certifications: certifications ? certifications.value || '' : '',
                languages: languages ? languages.value || '' : '',
                awards: awards ? awards.value || '' : '',
                hobbies: hobbies ? hobbies.value || '' : '',
                references: references ? references.value || '' : '',
                linkedin: linkedin ? linkedin.value || '' : '',
                github: github ? github.value || '' : '',
                signature: currentSignatureData || '',
                signatureName: signatureName ? signatureName.value || '' : '',
                created_at: new Date().toISOString()
            };
            
            var saved = localStorage.getItem('resumes');
            var resumes = saved ? JSON.parse(saved) : [];
            resumes.push(resumeData);
            localStorage.setItem('resumes', JSON.stringify(resumes));
            showToast('Resume saved successfully!');
            loadSavedResumes();
        });
    }
    
    // Load Saved Resumes
    function loadSavedResumes() {
        var savedList = document.getElementById('savedList');
        if (!savedList) return;
        
        var saved = localStorage.getItem('resumes');
        var resumes = saved ? JSON.parse(saved) : [];
        
        if (resumes.length > 0) {
            var html = '';
            for (var i = 0; i < resumes.length; i++) {
                var r = resumes[i];
                html += '<div style="background:var(--card-bg);border:2px solid var(--border-color);border-radius:12px;padding:1rem;margin-bottom:1rem;">';
                html += '<h3 style="color:var(--accent-color);">' + escapeHtml(r.full_name || 'No Name') + '</h3>';
                html += '<p>📧 ' + escapeHtml(r.email || '') + ' | 📞 ' + escapeHtml(r.phone || '') + '</p>';
                if (r.gender) html += '<p>⚥ ' + escapeHtml(r.gender) + '</p>';
                html += '<small>📅 ' + new Date(r.created_at).toLocaleDateString() + '</small><br>';
                html += '<button onclick="window.viewResume(' + r.id + ')" style="background:var(--accent-color);color:white;border:none;padding:0.3rem 0.8rem;border-radius:5px;margin-top:0.5rem;cursor:pointer;">📄 View Resume</button>';
                html += '</div>';
            }
            savedList.innerHTML = html;
        } else {
            savedList.innerHTML = '<div class="empty-state">📂 No saved resumes yet. Create your first resume!</div>';
        }
    }
    
    // View Resume Function
    window.viewResume = function(id) {
        var saved = localStorage.getItem('resumes');
        var resumes = saved ? JSON.parse(saved) : [];
        var resume = null;
        for (var i = 0; i < resumes.length; i++) {
            if (resumes[i].id === id) {
                resume = resumes[i];
                break;
            }
        }
        
        if (resume) {
            if (fullName) fullName.value = resume.full_name || '';
            if (gender) gender.value = resume.gender || '';
            if (email) email.value = resume.email || '';
            if (phone) phone.value = resume.phone || '';
            if (skills) skills.value = resume.skills || '';
            if (strengths) strengths.value = resume.strengths || '';
            if (education) education.value = resume.education || '';
            if (experience) experience.value = resume.experience || '';
            if (projects) projects.value = resume.projects || '';
            if (certifications) certifications.value = resume.certifications || '';
            if (languages) languages.value = resume.languages || '';
            if (awards) awards.value = resume.awards || '';
            if (hobbies) hobbies.value = resume.hobbies || '';
            if (references) references.value = resume.references || '';
            if (linkedin) linkedin.value = resume.linkedin || '';
            if (github) github.value = resume.github || '';
            if (signatureName) signatureName.value = resume.signatureName || '';
            
            currentSignatureData = resume.signature || null;
            if (currentSignatureData && canvas && ctx) {
                var img = new Image();
                img.onload = function() {
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    var ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
                    var width = img.width * ratio;
                    var height = img.height * ratio;
                    var x = (canvas.width - width) / 2;
                    var y = (canvas.height - height) / 2;
                    ctx.drawImage(img, x, y, width, height);
                };
                img.src = currentSignatureData;
            }
            
            showPage('builder');
            generatePreview();
            showToast('Resume loaded successfully');
        }
    };
    
    // PDF Download
    if (downloadBtn && previewDiv) {
        downloadBtn.addEventListener('click', function() {
            var element = previewDiv;
            var opt = {
                margin: [0.5, 0.5, 0.5, 0.5],
                filename: 'my-resume.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
            };
            if (typeof html2pdf !== 'undefined') {
                html2pdf().set(opt).from(element).save();
                showToast('PDF downloaded!');
            } else {
                showToast('Please wait, loading PDF library...');
                setTimeout(function() {
                    if (typeof html2pdf !== 'undefined') {
                        html2pdf().set(opt).from(element).save();
                        showToast('PDF downloaded!');
                    }
                }, 1000);
            }
        });
    }
    
    // Initial Preview
    generatePreview();
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinks && navLinks.classList.contains('active')) {
            if (!navLinks.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                navLinks.classList.remove('active');
            }
        }
    });
});