<script>
    import Badge from "$lib/components/ui/badge/badge.svelte";
</script>

<nav class="w-full h-14 flex items-center justify-between px-4 sm:px-6 md:px-10">
    <div class="flex items-center relative z-10">
        <a href="/" class="flex justify-center items-center space-x-2 sm:space-x-4 relative">
            <img src="https://www.upload.ee/image/17339414/k9crypt-rb.png" alt="k9crypt Logo" class="w-8 h-8 min-w-8 min-h-8">
            <span class="text-base sm:text-lg font-bold">K9Crypt Status</span>
            <Badge class="flex -ml-1 sm:-ml-2 text-xs">BETA</Badge>
        </a>
    </div>
    <ul class="flex space-x-2 sm:space-x-4 ml-auto">
        <li>
            <a href="https://github.com/k9crypt/status" class="flex items-center text-sm sm:text-base">
                <i class="ri-github-fill mr-1"></i>
                Github
            </a>
        </li>
    </ul>
</nav>