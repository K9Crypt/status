<script lang="ts">
    const year = new Date().getFullYear();
</script>

<footer class="w-full py-6 px-4 sm:px-6 md:px-10 mt-auto">
    <div class="flex flex-col md:flex-row items-center justify-between gap-4 text-sm opacity-30">
        <div class="flex items-center gap-2">
            <img src="/assets/logos/k9crypt-white.png" alt="k9crypt Logo" class="w-5">
            <p>&copy; {year} K9Crypt. All rights reserved.</p>
        </div>
        
        <div class="flex items-center gap-6">
            <a href="https://github.com/Pimatis" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1 hover:opacity-100 transition-opacity hover:underline text-xs">
                Made with <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"><path fill="currentColor" d="m12 21l-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812T2.388 10.4T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55t2.475-.55q2.35 0 3.925 1.575T22 8.15q0 1.15-.387 2.25t-1.363 2.412t-2.625 2.963T13.45 19.7z"/></svg> by Pimatis
            </a>
        </div>
    </div>
</footer>
