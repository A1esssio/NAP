// --- 1. Эффект Liquid Glass для кнопок калькулятора ---
        const buttons = document.querySelectorAll(".key");

        buttons.forEach((btn) => {
            btn.addEventListener("click", function (e) {
                const ripple = document.createElement("span");
                ripple.classList.add("ripple-effect");

                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                ripple.style.left = x + "px";
                ripple.style.top = y + "px";

                this.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // --- 2. Эффект исчезновения звезд и Марса при прокрутке ---
        const stars = document.getElementById("stars");
        const meteors = document.getElementById("meteors");
        const marsBg = document.getElementById("mars-bg");
        const scrollBtn = document.getElementById("scroll-down");

        window.addEventListener("scroll", () => {
            const scrollFraction = Math.min(window.scrollY / window.innerHeight, 1);
            const fadeOut = 1 - scrollFraction;
            stars.style.opacity = fadeOut;
            meteors.style.opacity = fadeOut;
            marsBg.style.opacity = fadeOut;
        });

        // --- 3. Плавное появление видео, текста и кнопки звука при доскролливании ---
        const landingSection = document.getElementById("landing-zone");
        const videoBlock = document.getElementById("rocket-video-container");
        const landingText = document.getElementById("landing-text");
        const muteBtn = document.getElementById("mute-btn");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        videoBlock.classList.add("visible");
                        landingText.classList.add("visible");
                        muteBtn.classList.add("visible");
                    } else {
                        videoBlock.classList.remove("visible");
                        landingText.classList.remove("visible");
                        muteBtn.classList.remove("visible");
                    }
                });
            },
            {threshold: 0.4},
        );

        observer.observe(landingSection);

        // --- 4. Плавная прокрутка вниз по клику на стрелочки ---
        scrollBtn.addEventListener("click", () => {
            window.scrollTo({
                top: window.innerHeight,
                behavior: "smooth",
            });
        });

        // --- 5. Управление звуком видео ---
        const video = document.getElementById("rocket-video");
        const iconMuted = muteBtn.querySelector(".icon-muted");
        const iconUnmuted = muteBtn.querySelector(".icon-unmuted");

        muteBtn.addEventListener("click", () => {
            // Переключаем звук
            video.muted = !video.muted;

            // Меняем иконки
            if (video.muted) {
                iconMuted.style.display = "block";
                iconUnmuted.style.display = "none";
            } else {
                iconMuted.style.display = "none";
                iconUnmuted.style.display = "block";
            }
        });

