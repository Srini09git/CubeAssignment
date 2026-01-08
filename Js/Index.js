
        // Hamburger Menu
        const hamburger = document.getElementById('hamburger');
        const nav = document.getElementById('nav');

        hamburger.addEventListener('click', () => {
            nav.classList.toggle('active');
        });

        // Gallery functionality
        const mainImage = document.getElementById("mainImage");
        const thumbnails = document.querySelectorAll(".thumbnail");
        const dots = document.querySelectorAll(".dot");
        const prevBtn = document.getElementById("prevBtn");
        const nextBtn = document.getElementById("nextBtn");

        let currentIndex = 0;

        const images = [
            "./Assets/product1.png",
            "./Assets/product2.jpg",
            "./Assets/product3.jpg",
            "./Assets/product4.jpg",
            "./Assets/product1.png",
            "./Assets/product2.jpg",
            "./Assets/product3.jpg",
            "./Assets/product4.jpg",
            

        ];

        function updateGallery(index) {
            currentIndex = index;

            // Update main image
            mainImage.querySelector("img").src = images[index];

            // Update thumbnails
            thumbnails.forEach((thumb, i) => {
                thumb.classList.toggle("active", i === index);
                thumb.querySelector("img").src = images[i];
            });

            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle("active", i === index);
            });
        }

        // Thumbnail click
        thumbnails.forEach((thumb, i) => {
            thumb.addEventListener("click", () => updateGallery(i));
        });

        // Dot click
        dots.forEach((dot, i) => {
            dot.addEventListener("click", () => updateGallery(i));
        });

        // Prev / Next
        prevBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const index = (currentIndex - 1 + images.length) % images.length;
            updateGallery(index);
        });

        nextBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const index = (currentIndex + 1) % images.length;
            updateGallery(index);
        });

        // Initial load
        updateGallery(0);

        // Subscription selection
        const singleSub = document.getElementById('singleSub');
        const doubleSub = document.getElementById('doubleSub');

        singleSub.addEventListener('click', () => {
            singleSub.classList.add('active');
            doubleSub.classList.remove('active');
            updateAddToCartLink();
        });

        doubleSub.addEventListener('click', () => {
            doubleSub.classList.add('active');
            singleSub.classList.remove('active');
            updateAddToCartLink();
        });

        // Fragrance selection
        const fragranceCards = document.querySelectorAll('.fragrance-card');
        
        fragranceCards.forEach(card => {
            card.addEventListener('click', () => {
                const radio = card.querySelector('input[type="radio"]');
                radio.checked = true;
                
                const groupName = radio.name;
                document.querySelectorAll(`input[name="${groupName}"]`).forEach(r => {
                    r.closest('.fragrance-card').classList.remove('selected');
                });
                
                card.classList.add('selected');
                updateAddToCartLink();
            });
        });

        // Update Add to Cart link
        function updateAddToCartLink() {
            const addToCartBtn = document.getElementById('addToCart');
            const isSingle = singleSub.classList.contains('active');
            let fragrance1, fragrance2;

            if (isSingle) {
                const selectedFragrance = document.querySelector('input[name="single-fragrance"]:checked');
                fragrance1 = selectedFragrance ? selectedFragrance.closest('.fragrance-card').dataset.fragrance : 'original';
                addToCartBtn.onclick = () => {
                    window.location.href = `https://shop.gtg.com/cart/add?subscription=single&fragrance=${fragrance1}`;
                };
            } else {
                const selectedFragrance1 = document.querySelector('input[name="double-fragrance-1"]:checked');
                const selectedFragrance2 = document.querySelector('input[name="double-fragrance-2"]:checked');
                fragrance1 = selectedFragrance1 ? selectedFragrance1.closest('.fragrance-card').dataset.fragrance : 'original';
                fragrance2 = selectedFragrance2 ? selectedFragrance2.closest('.fragrance-card').dataset.fragrance : 'original';
                addToCartBtn.onclick = () => {
                    window.location.href = `https://shop.gtg.com/cart/add?subscription=double&fragrance1=${fragrance1}&fragrance2=${fragrance2}`;
                };
            }
        }

        // Initialize cart link
        updateAddToCartLink();

        // Collection FAQ functionality
        const collectionItems = document.querySelectorAll('.collection-item');
        
        collectionItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                const content = item.nextElementSibling;
                const icon = item.querySelector('.toggle-icon');
                const isActive = item.classList.contains('active');
                
                // Close all items
                collectionItems.forEach((otherItem, otherIndex) => {
                    const otherContent = otherItem.nextElementSibling;
                    const otherIcon = otherItem.querySelector('.toggle-icon');
                    otherItem.classList.remove('active');
                    if (otherContent && otherContent.classList.contains('collection-content')) {
                        otherContent.classList.remove('active');
                        otherIcon.textContent = '+';
                    }
                });
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                    if (content && content.classList.contains('collection-content')) {
                        content.classList.add('active');
                        icon.textContent = '−';
                    }
                }
            });
        });

        // Stats counter animation
        function animateValue(element, start, end, duration) {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                element.textContent = Math.floor(progress * (end - start) + start) + '%';
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }

        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statItems = document.querySelectorAll('.stat-item');
                    statItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('animated');
                            const percentage = item.querySelector('.stat-percentage');
                            const target = parseInt(percentage.getAttribute('data-target'));
                            animateValue(percentage, 0, target, 2000);
                        }, index * 200);
                    });
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const statsSection = document.getElementById('stats');
        observer.observe(statsSection);

        // Lazy loading for images
        document.addEventListener('DOMContentLoaded', () => {
            const lazyImages = document.querySelectorAll('img[data-src]');
            
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('loading');
                        observer.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => {
                img.classList.add('loading');
                imageObserver.observe(img);
            });
        });
   