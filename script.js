document.addEventListener('DOMContentLoaded', () => {
	// Declare Variables
	const orange700 = 'hsl(7, 71%, 60%)';

	const inputFile = document.querySelector('#input-file');
	const imgView = document.querySelector('.img-view');
	const caution = document.querySelector('.caution-desc');
	const cautionIcon = document.querySelector('.caution-info');

	const validTypes = ['image/jpeg', 'image/png'];
	const form = document.querySelector('.ticket-form');
	const emailWarning = document.querySelector('.email-warning');
	const emailCautionText = document.querySelector('.email-caution-text');

	const inputs = form.querySelectorAll('input');
	const fullNameInput = document.querySelector('#full-name');
	const emailInput = document.querySelector('#email');
	const githubInput = document.querySelector(
		'input[placeholder="@yourusername"]'
	);

	// Validating email
	const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

	// Reseting image
	const resetImage = () => {
		imgView.innerHTML = `
        <img src="/assets/images/icon-upload.svg" alt="upload" class="img-view__img" />
        <p class="img-view__desc">Drag and drop or click to upload</p>
    `;
		imgView.style.border = '2px dashed var(--Neutral-500)';
		inputFile.value = '';
		localStorage.removeItem('ticketAvatar'); // Remove the image from local storage
	};

	// Insert the users avatar
	const handleFile = (file) => {
		if (!file) return;

		if (!validTypes.includes(file.type)) {
			caution.textContent = 'Only JPG and PNG files are allowed!';
			caution.style.color = orange700;
			cautionIcon.style.filter =
				'brightness(0) saturate(100%) invert(24%) sepia(100%) saturate(7484%) hue-rotate(0deg) brightness(94%) contrast(121%)';
			inputFile.value = '';
			return;
		}

		if (file.size > 500 * 1024) {
			caution.textContent = 'File size must be less than 500KB!';
			caution.style.color = orange700;
			cautionIcon.style.filter =
				'brightness(0) saturate(100%) invert(24%) sepia(100%) saturate(7484%) hue-rotate(0deg) brightness(94%) contrast(121%)';
			inputFile.value = '';
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			const imgLink = e.target.result;
			localStorage.setItem('ticketAvatar', imgLink); // Save the image to local storage
			imgView.innerHTML = `
            <img src="${imgLink}" alt="avatar" class="img-avatar">
            <div class="img-buttons">
                <button class="remove-img">Remove Image</button>
                <button class="change-img">Change Image</button>
            </div>
        `;
			imgView.classList.add('has-image');
		};
		reader.readAsDataURL(file);

		document.querySelector('.remove-img').addEventListener('click', resetImage);
		document
			.querySelector('.change-img')
			.addEventListener('click', () => inputFile.click());
	};

	inputFile.addEventListener('change', () => {
		if (inputFile.files.length > 0) {
			handleFile(inputFile.files[0]);
		}
	});
	// Function to support draging images
	imgView.addEventListener('dragover', (e) => {
		e.preventDefault();
		imgView.style.border = '2px dashed hsl(7, 71%, 60%)';
	});

	imgView.addEventListener('dragleave', () => {
		imgView.style.border = '2px dashed var(--Neutral-500)';
	});

	imgView.addEventListener('drop', (e) => {
		e.preventDefault();
		imgView.style.border = '2px dashed var(--Neutral-500)';
		const files = e.dataTransfer.files;
		if (files.length > 0) {
			handleFile(files[0]);
		}
	});

	// Form submit
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		let hasError = false;

		const hasPhoto = imgView.classList.contains('has-image');

		const fullNameValue = fullNameInput.value.trim();

		if (!/^[A-Za-z\s]+$/.test(fullNameValue)) {
			fullNameInput.classList.add('input-error');
			fullNameInput.style.border = '2px solid hsl(7, 71%, 60%)';
			fullNameInput.style.transition = 'border 0.3s ease-in-out';
			fullNameInput.classList.add('shake');
			setTimeout(() => fullNameInput.classList.remove('shake'), 500);
			hasError = true;
		} else {
			localStorage.setItem('ticketName', fullNameValue);
			fullNameInput.classList.remove('input-error');
			fullNameInput.style.border = '';
		}

		const githubValue = githubInput.value.trim();
		const formattedGithubValue = githubValue.startsWith('@')
			? githubValue
			: `@${githubValue}`;
		if (!/^@[A-Za-z0-9_-]+$/.test(githubValue)) {
			githubInput.classList.add('input-error');
			githubInput.style.border = '2px solid hsl(7, 71%, 60%)';
			githubInput.style.transition = 'border 0.3s ease-in-out';
			githubInput.classList.add('shake');
			setTimeout(() => githubInput.classList.remove('shake'), 500);
			hasError = true;
		} else {
			localStorage.setItem('ticketGit', formattedGithubValue);
			githubInput.classList.remove('input-error');
			githubInput.style.border = '';
		}

		const emailValue = emailInput.value.trim();

		if (emailValue !== '' && !validateEmail(emailInput.value)) {
			emailCautionText.textContent = 'Please enter a valid email address!';
			emailWarning.style.display = 'flex';
			emailCautionText.style.color = orange700;
			emailInput.classList.add('input-error');
			hasError = true;
		} else {
			localStorage.setItem('ticketEmail', emailValue);
			emailWarning.style.display = 'none';
			emailInput.classList.remove('input-error');
		}

		if (!hasPhoto) {
			caution.textContent = 'Please upload a photo!';
			caution.style.color = orange700;
			cautionIcon.style.filter =
				'brightness(0) saturate(100%) invert(24%) sepia(100%) saturate(7484%) hue-rotate(0deg) brightness(94%) contrast(121%)';
			hasError = true;
		} else {
			console.log(e);
			caution.textContent = 'Upload your photo (JPG or PNG, max size: 500KB).';
			caution.style.color = '';
			cautionIcon.style.filter = '';
		}

		if (!hasError) {
			inputs.forEach((input) => {
				input.value = '';
			});

			resetImage();
		}
		const today = new Date();
		const options = { year: 'numeric', month: 'short', day: '2-digit' };
		const formattedDate = today
			.toLocaleDateString('en-US', options)
			.replace(',', '');
		const ticketOrderId = Math.floor(10000 + Math.random() * 90000);

		const savedAvatar =
			localStorage.getItem('ticketAvatar') || '/assets/images/image-avatar.jpg';
		const svgContent = `<svg
						xmlns="http://www.w3.org/2000/svg"
						width="600"
						height="280"
						fill="none"
						viewBox="0 0 600 280"
						class="ticket-container"
					>
						<g filter="url(#a)">
							<mask id="d" fill="#fff">
								<path
									fill-rule="evenodd"
									d="M0 12C0 5.373 5.373 0 12 0h438.958c5.37 0 9.876 3.759 12.94 8.169C468.863 15.319 477.135 20 486.5 20s17.637-4.681 22.602-11.831c3.064-4.41 7.57-8.169 12.94-8.169H588c6.627 0 12 5.373 12 12v256c0 6.627-5.373 12-12 12h-65.958c-5.37 0-9.876-3.759-12.94-8.169C504.137 264.681 495.865 260 486.5 260s-17.637 4.681-22.602 11.831c-3.064 4.41-7.57 8.169-12.94 8.169H12c-6.627 0-12-5.373-12-12V12Z"
									clip-rule="evenodd"
								/>
							</mask>
							<path
								fill="url(#b)"
								fill-rule="evenodd"
								d="M0 12C0 5.373 5.373 0 12 0h438.958c5.37 0 9.876 3.759 12.94 8.169C468.863 15.319 477.135 20 486.5 20s17.637-4.681 22.602-11.831c3.064-4.41 7.57-8.169 12.94-8.169H588c6.627 0 12 5.373 12 12v256c0 6.627-5.373 12-12 12h-65.958c-5.37 0-9.876-3.759-12.94-8.169C504.137 264.681 495.865 260 486.5 260s-17.637 4.681-22.602 11.831c-3.064 4.41-7.57 8.169-12.94 8.169H12c-6.627 0-12-5.373-12-12V12Z"
								clip-rule="evenodd"
							/>
							<path
								fill="url(#c)"
								d="m463.898 271.831 1.232.856-1.232-.856Zm45.204 0 1.232-.856-1.232.856Zm0-263.662 1.232.856-1.232-.856Zm-45.204 0-1.232.856 1.232-.856ZM450.958-1.5H12v3h438.958v-3Zm35.542 20c-8.853 0-16.673-4.423-21.37-11.187l-2.464 1.712C467.9 16.56 476.623 21.5 486.5 21.5v-3Zm21.37-11.187C503.173 14.077 495.353 18.5 486.5 18.5v3c9.877 0 18.6-4.94 23.834-12.475l-2.464-1.712ZM588-1.5h-65.958v3H588v-3ZM601.5 268V12h-3v256h3Zm-79.458 13.5H588v-3h-65.958v3Zm-35.542-20c8.853 0 16.673 4.423 21.37 11.187l2.464-1.712C505.1 263.439 496.377 258.5 486.5 258.5v3Zm-21.37 11.187c4.697-6.764 12.517-11.187 21.37-11.187v-3c-9.877 0-18.6 4.939-23.834 12.475l2.464 1.712ZM12 281.5h438.958v-3H12v3ZM-1.5 12v256h3V12h-3ZM12 278.5c-5.799 0-10.5-4.701-10.5-10.5h-3c0 7.456 6.044 13.5 13.5 13.5v-3Zm450.666-7.525c-2.952 4.25-7.065 7.525-11.708 7.525v3c6.097 0 10.997-4.242 14.172-8.813l-2.464-1.712Zm59.376 7.525c-4.643 0-8.756-3.275-11.708-7.525l-2.464 1.712c3.175 4.571 8.075 8.813 14.172 8.813v-3ZM588 1.5c5.799 0 10.5 4.701 10.5 10.5h3c0-7.456-6.044-13.5-13.5-13.5v3Zm-77.666 7.525c2.952-4.25 7.065-7.525 11.708-7.525v-3c-6.097 0-10.997 4.242-14.172 8.813l2.464 1.712ZM12-1.5C4.544-1.5-1.5 4.544-1.5 12h3C1.5 6.201 6.201 1.5 12 1.5v-3ZM598.5 268c0 5.799-4.701 10.5-10.5 10.5v3c7.456 0 13.5-6.044 13.5-13.5h-3ZM450.958 1.5c4.643 0 8.756 3.275 11.708 7.525l2.464-1.712c-3.175-4.571-8.075-8.813-14.172-8.813v3Z"
								mask="url(#d)"
							/>
						</g>
						<rect
							width="3"
							height="16"
							x="485"
							y="42"
							fill="#fff"
							opacity=".2"
							rx="1.5"
						/>
						<rect
							width="3"
							height="16"
							x="485"
							y="72"
							fill="#fff"
							opacity=".2"
							rx="1.5"
						/>
						<rect
							width="3"
							height="16"
							x="485"
							y="102"
							fill="#fff"
							opacity=".2"
							rx="1.5"
						/>
						<rect
							width="3"
							height="16"
							x="485"
							y="132"
							fill="#fff"
							opacity=".2"
							rx="1.5"
						/>
						<rect
							width="3"
							height="16"
							x="485"
							y="162"
							fill="#fff"
							opacity=".2"
							rx="1.5"
						/>
						<rect
							width="3"
							height="16"
							x="485"
							y="192"
							fill="#fff"
							opacity=".2"
							rx="1.5"
						/>
						<rect
							width="3"
							height="16"
							x="485"
							y="222"
							fill="#fff"
							opacity=".2"
							rx="1.5"
						/>
						<image href="/assets/images/logo-mark.svg" x="23" y="30" />
						<text
							x="80"
							y="50"
							font-family="Inconsolata, monospace"
							font-size="28"
							font-weight="bold"
							fill="#FFFFFF"
						>
							Coding Conf
						</text>
						<text
							x="80"
							y="80"
							font-family="Inconsolata, monospace"
							font-size="16"
							fill="#CCCCCC"
						>
							 ${formattedDate} / Austin, TX
						</text>
						<text
							x="325"
							y="-124"
							font-size="25"
							fill="gray"
							transform="rotate(90, 320, 100)"
						>
							#${ticketOrderId}
						</text>
						<image
							href="${savedAvatar}"
							width="70"
							x="20"
							y="190"
							r="30"
							clip-path="url(#avatarClip)"
						/>

						<text
							x="105"
							y="223"
							font-family="Inconsolata, monospace"
							font-size="24"
							fill="#FFFFFF"
						>
							${fullNameValue}
						</text>
						<image href="/assets/images/icon-github.svg" x="110" y="233" />
						<text
							x="140"
							y="250"
							font-family="Inconsolata, monospace"
							font-size="16"
							fill="#AAAAAA"
						>
							${formattedGithubValue}
						</text>
						<defs>
							<clipPath id="avatarClip">
								<rect x="20" y="190" width="70" height="70" rx="15" ry="15" />
							</clipPath>
							<linearGradient
								id="b"
								x1="610"
								x2="69.328"
								y1="26.462"
								y2="306.194"
								gradientUnits="userSpaceOnUse"
							>
								<stop stop-color="#fff" stop-opacity=".3" />
								<stop offset="1" stop-color="#fff" stop-opacity=".1" />
							</linearGradient>
							<linearGradient
								id="c"
								x1="0"
								x2="599.999"
								y1="140"
								y2="139.351"
								gradientUnits="userSpaceOnUse"
							>
								<stop stop-color="#fff" />
								<stop offset="1" stop-color="#F37362" />
							</linearGradient>
							<filter
								id="a"
								width="680"
								height="360"
								x="-40"
								y="-40"
								color-interpolation-filters="sRGB"
								filterUnits="userSpaceOnUse"
							>
								<feFlood flood-opacity="0" result="BackgroundImageFix" />
								<feGaussianBlur in="BackgroundImageFix" stdDeviation="20" />
								<feComposite
									in2="SourceAlpha"
									operator="in"
									result="effect1_backgroundBlur_107_802"
								/>
								<feBlend
									in="SourceGraphic"
									in2="effect1_backgroundBlur_107_802"
									result="shape"
								/>
							</filter>
						</defs>
					</svg>`;
		const headerInfo = `<div class="header__logo">
						<img
							src="./assets/images/logo-full.svg"
							alt="logo"
							class="header__logo-img"
						/>
					</div>
					<div class="header__description">
						<h1 class="header__description-title">
							Congrats, <span class="description-span">${fullNameValue}</span
							><br />Your ticket is ready
						</h1>
						<p class="header__description-paragraph">
							We've emailed your ticket to <br />
							<span class="description-span">${emailValue}</span> and will
							send updates in<br />
							the run up to the event
						</p>
					</div>`;
		console.log(savedAvatar);
		// Clear the children of header and main
		document.querySelector('.header').innerHTML = '';
		document.querySelector('.main').innerHTML = '';

		// Insert the new content
		document.querySelector('.header').innerHTML = headerInfo;
		document.querySelector('.main').innerHTML = svgContent;
	});
	const resetPage = () => {
		// Clear local storage
		localStorage.clear();

		// Reset form fields
		inputs.forEach((input) => {
			input.value = '';
		});

		// Reset image view

		// Reset header and main to their initial state
		document.querySelector('.header').innerHTML = `
            <div class="header__logo">
                <img
                    src="./assets/images/logo-full.svg"
                    alt="logo"
                    class="header__logo-img"
                />
            </div>
            <div class="header__description">
                <h1 class="header__description-title">
                    Your Journey to Coding Conf <br />2025 Starts Here!
                </h1>
                <p class="header__description-paragraph">
                    Secure your spot at next year's biggest coding conference.
                </p>
            </div>
        `;

		document.querySelector('.main').innerHTML = `
            <div class="main__ticket-form">
                <div class="main__ticket-avatar">
                    <h4 class="main__ticket-avatar__title">Upload Avatar</h4>
                    <label for="input-file">
                        <input type="file" id="input-file" accept="image/*" hidden />
                        <div class="img-view">
                            <img
                                src="/assets/images/icon-upload.svg"
                                alt="upload"
                                class="img-view__img"
                            />
                            <p class="img-view__desc">Drag and drop or click to upload</p>
                        </div>
                        <div class="input-file__caution">
                            <img
                                src="/assets/images/icon-info.svg"
                                alt="info"
                                class="caution-info"
                            />
                            <p class="caution-desc">
                                Upload your photo(JPG or PNG, max size: 500KB).
                            </p>
                        </div>
                    </label>
                </div>
                <form class="ticket-form">
                    <label for="full-name">Full Name</label>
                    <input type="text" id="full-name" placeholder="" />

                    <label for="email">Email Address</label>
                    <input type="email" id="email" placeholder="example@email.com" />
                    <div class="email-warning">
                        <img
                            src="/assets/images/icon-info.svg"
                            alt="info"
                            class="email-caution-icon"
                        />
                        <p class="email-caution-text"></p>
                    </div>
                    <label for="github">GitHub Username</label>
                    <input type="text" id="github" placeholder="@yourusername" />

                    <button type="submit">Generate My Ticket</button>
                </form>
            </div>
        `;
	};
	window.addEventListener('beforeunload', resetPage);
});
