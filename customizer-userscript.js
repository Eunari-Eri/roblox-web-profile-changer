// ==UserScript==
// @name         Roblox Web Profile Changer
// @version      1.0
// @description  Adds mobile-exclusive Profile Changing features to Roblox web
// @author       Eri (78bfff)
// @match        https://www.roblox.com/users/*/profile*
// @grant        none
// ==/UserScript==

(function() {
    function getCurrentUserId() {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: "https://users.roblox.com/v1/users/authenticated",
                method: "GET",
                success: function(response) {
                    resolve(response.id);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    reject(textStatus);
                }
            });
        });
    }

    function loadSettings() {
        const distanceScaleValue = document.getElementById('distanceScaleValue');
        const fieldOfViewDegValue = document.getElementById('fieldOfViewDegValue');
        const yRotDegValue = document.getElementById('yRotDegValue');
        const distanceScale = document.getElementById('distanceScale');
        const distanceScaleLabel = document.getElementById('distanceScaleLabel');
    
        if (distanceScaleValue && fieldOfViewDegValue && yRotDegValue && distanceScale && distanceScaleLabel) {
            const settings = JSON.parse(localStorage.getItem('profileChangerSettings'));
            if (settings) {
                distanceScale.value = settings.distanceScale;
                distanceScaleValue.innerText = settings.distanceScale;
                document.getElementById('fieldOfViewDeg').value = settings.fieldOfViewDeg;
                fieldOfViewDegValue.innerText = settings.fieldOfViewDeg;
                document.getElementById('yRotDeg').value = settings.yRotDeg;
                yRotDegValue.innerText = settings.yRotDeg;
                document.getElementById('emoteAssetId').value = settings.emoteAssetId;
                document.getElementById('thumbnailType').value = settings.thumbnailType;
    
                if (settings.thumbnailType == '2') {
                    distanceScale.style.display = 'none';
                    distanceScaleLabel.innerHTML = 'Camera Distance Scale: <b><u>1 is the unchangeable default value of this option</u></b>';
                } else {
                    distanceScale.style.display = 'block';
                    distanceScaleLabel.innerHTML = 'Camera Distance Scale (0.5 to 4): <span id="distanceScaleValue" style="color: #d4d4d4;">' + settings.distanceScale + '</span>';
                }
            }
        }
    }

    function saveSettings() {
        const settings = {
            distanceScale: document.getElementById('distanceScale').value,
            fieldOfViewDeg: document.getElementById('fieldOfViewDeg').value,
            yRotDeg: document.getElementById('yRotDeg').value,
            emoteAssetId: document.getElementById('emoteAssetId').value,
            thumbnailType: document.getElementById('thumbnailType').value,
        };
        localStorage.setItem('profileChangerSettings', JSON.stringify(settings));
    }

    getCurrentUserId().then(function(userId) {
        var profileUserId = parseInt(window.location.pathname.split('/')[2]);
        if (profileUserId === userId) {
            var dropdownMenu = document.querySelector('.dropdown-menu[aria-labelledby="popover-link"]');
            if (dropdownMenu) {
                var robloxProfileChangerItem = document.createElement('li');
                robloxProfileChangerItem.setAttribute('role', 'presentation');

                var link = document.createElement('a');
                link.setAttribute('role', 'menuitem');
                link.setAttribute('tabindex', '-1');
                link.innerText = 'Profile Changer';
                link.style.cursor = 'pointer';
                robloxProfileChangerItem.appendChild(link);

                dropdownMenu.appendChild(robloxProfileChangerItem);

                var uiBox = document.createElement('div');
                uiBox.style.position = 'fixed';
                uiBox.style.top = '50%';
                uiBox.style.left = '50%';
                uiBox.style.transform = 'translate(-50%, -50%)';
                uiBox.style.backgroundColor = '#1b1b1b';
                uiBox.style.color = '#d4d4d4';
                uiBox.style.padding = '20px';
                uiBox.style.border = '2px solid #333333';
                uiBox.style.borderRadius = '20px';
                uiBox.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
                uiBox.style.maxWidth = '400px';
                uiBox.style.display = 'none';
                uiBox.style.opacity = '0';
                uiBox.style.transition = 'opacity 0.3s ease';
                uiBox.style.zIndex = '9999';

                document.body.appendChild(uiBox);

                uiBox.innerHTML += `
                    <div style="text-align: center;">
                        <h1 style="margin: 0 0 -10px; color: #d4d4d4; font-size: 24px;">Roblox Web Profile Changer</h1>
                        <div style="font-size: 12px;">By <a href="https://www.roblox.com/users/3142512476/profile" target=_blank><u>Eri</u></a></div>
                    </div>
                    <br>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <label for="distanceScale" id="distanceScaleLabel" style="color: #d4d4d4;">Camera Distance Scale (0.5 to 4): <span id="distanceScaleValue" style="color: #d4d4d4;">1</span></label>
                        <input type="range" id="distanceScale" name="distanceScale" min="0.5" max="4" step="0.01" value="1" style="accent-color: #0066cc;">

                        <label for="fieldOfViewDeg" style="color: #d4d4d4;">Camera Field of View (15 to 45): <span id="fieldOfViewDegValue" style="color: #d4d4d4;">15</span></label>
                        <input type="range" id="fieldOfViewDeg" name="fieldOfViewDeg" min="15" max="45" step="1" value="15" style="accent-color: #0066cc;">

                        <label for="yRotDeg" style="color: #d4d4d4;">Camera Y Rotation (-60 to 60): <span id="yRotDegValue" style="color: #d4d4d4;">0</span></label>
                        <input type="range" id="yRotDeg" name="yRotDeg" min="-60" max="60" step="1" value="0" style="accent-color: #0066cc;">

                        <br>

                        <label for="emoteAssetId" style="color: #d4d4d4;">Emote/Avatar Animation Asset ID (0 = default): <a href="#" id="emoteInfoLink" style="color: #0066cc;" target="_blank"><span style="font-size: 12px; vertical-align: middle;">&#9432;</span></a></label>
                        <input type="number" id="emoteAssetId" name="emoteAssetId" min="0" value="0" style="background-color: #333333; color: #d4d4d4; border: 1px solid #666666;">

                        <br> 

                        <label for="thumbnailType" style="color: #d4d4d4;">Profile Type: </label>
                        <select id="thumbnailType" name="thumbnailType" style="background-color: #333333; color: #d4d4d4; border: 1px solid #666666;">
                            <option value="1">Closeup (headshot)</option>
                            <option value="2">FullBody (bodyshot)</option>
                        </select>

                        <br>

                        <div style="display: flex; gap: 10px; justify-content: center;">
                            <button id="submitBtn" class="roblox-themed" style="padding: 10px 20px; background-color: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Apply Changes</button>
                            <button id="revertBtn" class="roblox-themed" style="padding: 10px 20px; background-color: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">Revert Changes</button>
                        </div>
                        <div style="display: flex; justify-content: center;">
                            <button id="viewChangesBtn" class="roblox-themed" style="padding: 10px 20px; margin-bottom: 10px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">View Current Changes (API)</button>
                        </div>
                    </div>
                    <button id="closeBtn" style="position: absolute; top: 2px; right: 2px; background-color: red; border: none; border-radius: 9px; color: #d4d4d4; font-size: 16px; width: 25px; height: 25px; cursor: pointer;">&times;</button>
                    <div style="text-align: center; color: #aaa; font-size: 10px; margin-top: 10px;">Userscript Version</div>
                `;

                var closeButton = uiBox.querySelector('#closeBtn');
                closeButton.style.fontSize = '20px';

                var emoteInfoLink = document.getElementById('emoteInfoLink');
                emoteInfoLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.open('https://via.placeholder.com/1200x400', '_blank');
                });

                link.addEventListener('click', function() {
                    uiBox.style.display = 'block';
                    loadSettings(); 
                    setTimeout(function() {
                        uiBox.style.opacity = '1';
                    }, 10);
                });

                closeButton.addEventListener('click', function(event) {
                    event.stopPropagation();
                    uiBox.style.opacity = '0';
                    setTimeout(function() {
                        uiBox.style.display = 'none';
                    }, 300);
                });

                document.getElementById('distanceScale').addEventListener('input', function() {
                    document.getElementById('distanceScaleValue').innerText = this.value;
                });
                document.getElementById('fieldOfViewDeg').addEventListener('input', function() {
                    document.getElementById('fieldOfViewDegValue').innerText = this.value;
                });
                document.getElementById('yRotDeg').addEventListener('input', function() {
                    document.getElementById('yRotDegValue').innerText = this.value;
                });

                var distanceScaleLabel = document.getElementById('distanceScaleLabel');
                var distanceScaleInput = document.getElementById('distanceScale');

                document.getElementById('thumbnailType').addEventListener('change', function() {
                    if (this.value == '2') {
                        distanceScaleInput.style.display = 'none';
                        distanceScaleLabel.innerHTML = 'Camera Distance Scale: <b><u>1 is the unchangeable default value of this option</u></b>';                    
                    } else {
                        distanceScaleInput.style.display = 'block';
                        distanceScaleLabel.innerHTML = 'Camera Distance Scale (0.5 to 4): <span id="distanceScaleValue" style="color: #d4d4d4;">' + distanceScaleInput.value + '</span>';
                    }
                });

                document.getElementById('submitBtn').addEventListener('click', function() {
                    var distanceScale = parseFloat(document.getElementById('distanceScale').value);
                    var fieldOfViewDeg = parseInt(document.getElementById('fieldOfViewDeg').value);
                    var yRotDeg = parseInt(document.getElementById('yRotDeg').value);
                    var emoteAssetId = parseInt(document.getElementById('emoteAssetId').value);
                    var thumbnailType = parseInt(document.getElementById('thumbnailType').value);

                    if (thumbnailType === 2) {
                        distanceScale = -1;
                    }

                    $.ajax({
                        method: "POST",
                        url: "https://avatar.roblox.com/v1/avatar/thumbnail-customization",
                        contentType: "application/json",
                        data: JSON.stringify({
                            "camera": {
                                "distanceScale": distanceScale,
                                "fieldOfViewDeg": fieldOfViewDeg,
                                "yRotDeg": yRotDeg
                            },
                            "emoteAssetId": emoteAssetId,
                            "thumbnailType": thumbnailType
                        })
                    }).then(function(data) {
                        console.log(data);
                        saveSettings(); 
                        window.location.href = window.location.href;
                    }).fail(function(error) {
                        alert(error.responseJSON.errors[0].message);
                    });
                });

                document.getElementById('revertBtn').addEventListener('click', function() {
                    for (let thumbnailType = 1; thumbnailType < 3; thumbnailType++) {
                        $.ajax({
                            method: "POST",
                            url: "https://avatar.roblox.com/v1/avatar/thumbnail-customization",
                            contentType: "application/json",
                            data: JSON.stringify({
                                camera: {
                                    distanceScale: -1,
                                    fieldOfViewDeg: 30,
                                    yRotDeg: 0
                                },
                                emoteAssetId: 0,
                                thumbnailType: thumbnailType,
                            })
                        }).then(function(data) {
                            console.log(data);
                            window.location.href = window.location.href;
                        }).fail(function(error) {
                            alert(error.responseJSON.errors[0].message);
                        });
                    }
                    localStorage.removeItem('profileChangerSettings');
                });

                document.getElementById('viewChangesBtn').addEventListener('click', function() {
                    window.open("https://avatar.roblox.com/v1/avatar/thumbnail-customizations", "_blank");
                });

                console.log("The script has successfully implemented its features inside your profile dropdown. Happy profile customizing!");
            } else {
                console.log("Dropdown menu not found.");
            }
        } else {
            console.log("This script can only be run by the logged-in user on their own Roblox profile page.");
        }
    }).catch(function(error) {
        console.error("Failed to fetch current user ID:", error);
    });
})();
