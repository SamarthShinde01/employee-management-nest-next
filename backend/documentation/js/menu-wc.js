'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">backend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-5c65672b653acb54c964d265a08b07204876e26bc1d4a28100cadecd60648ec32c039792eba0fae2eae05e9d011396b212eec704f2eb18716282a63a94785fba"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-5c65672b653acb54c964d265a08b07204876e26bc1d4a28100cadecd60648ec32c039792eba0fae2eae05e9d011396b212eec704f2eb18716282a63a94785fba"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-5c65672b653acb54c964d265a08b07204876e26bc1d4a28100cadecd60648ec32c039792eba0fae2eae05e9d011396b212eec704f2eb18716282a63a94785fba"' :
                                            'id="xs-controllers-links-module-AuthModule-5c65672b653acb54c964d265a08b07204876e26bc1d4a28100cadecd60648ec32c039792eba0fae2eae05e9d011396b212eec704f2eb18716282a63a94785fba"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-5c65672b653acb54c964d265a08b07204876e26bc1d4a28100cadecd60648ec32c039792eba0fae2eae05e9d011396b212eec704f2eb18716282a63a94785fba"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-5c65672b653acb54c964d265a08b07204876e26bc1d4a28100cadecd60648ec32c039792eba0fae2eae05e9d011396b212eec704f2eb18716282a63a94785fba"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-5c65672b653acb54c964d265a08b07204876e26bc1d4a28100cadecd60648ec32c039792eba0fae2eae05e9d011396b212eec704f2eb18716282a63a94785fba"' :
                                        'id="xs-injectables-links-module-AuthModule-5c65672b653acb54c964d265a08b07204876e26bc1d4a28100cadecd60648ec32c039792eba0fae2eae05e9d011396b212eec704f2eb18716282a63a94785fba"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DepartmentsModule.html" data-type="entity-link" >DepartmentsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-DepartmentsModule-fe51e414fbc93d633112e3924f92f1b3a631d7aaf08c5b54eb8f24367c26359743a92fea6959dbc28b1898f4b1baba1f7b77ce9749e305a4680849008db71502"' : 'data-bs-target="#xs-controllers-links-module-DepartmentsModule-fe51e414fbc93d633112e3924f92f1b3a631d7aaf08c5b54eb8f24367c26359743a92fea6959dbc28b1898f4b1baba1f7b77ce9749e305a4680849008db71502"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-DepartmentsModule-fe51e414fbc93d633112e3924f92f1b3a631d7aaf08c5b54eb8f24367c26359743a92fea6959dbc28b1898f4b1baba1f7b77ce9749e305a4680849008db71502"' :
                                            'id="xs-controllers-links-module-DepartmentsModule-fe51e414fbc93d633112e3924f92f1b3a631d7aaf08c5b54eb8f24367c26359743a92fea6959dbc28b1898f4b1baba1f7b77ce9749e305a4680849008db71502"' }>
                                            <li class="link">
                                                <a href="controllers/DepartmentsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DepartmentsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-DepartmentsModule-fe51e414fbc93d633112e3924f92f1b3a631d7aaf08c5b54eb8f24367c26359743a92fea6959dbc28b1898f4b1baba1f7b77ce9749e305a4680849008db71502"' : 'data-bs-target="#xs-injectables-links-module-DepartmentsModule-fe51e414fbc93d633112e3924f92f1b3a631d7aaf08c5b54eb8f24367c26359743a92fea6959dbc28b1898f4b1baba1f7b77ce9749e305a4680849008db71502"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-DepartmentsModule-fe51e414fbc93d633112e3924f92f1b3a631d7aaf08c5b54eb8f24367c26359743a92fea6959dbc28b1898f4b1baba1f7b77ce9749e305a4680849008db71502"' :
                                        'id="xs-injectables-links-module-DepartmentsModule-fe51e414fbc93d633112e3924f92f1b3a631d7aaf08c5b54eb8f24367c26359743a92fea6959dbc28b1898f4b1baba1f7b77ce9749e305a4680849008db71502"' }>
                                        <li class="link">
                                            <a href="injectables/DepartmentsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DepartmentsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ExpenseCategoryModule.html" data-type="entity-link" >ExpenseCategoryModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ExpenseCategoryModule-2a2525490c2c178b1607f54abc2344b185654c6d65baf33452f3131247e7456d7488a1819690a52faad492b30228788ee2e13d99f886e935ec35d4684744b955"' : 'data-bs-target="#xs-controllers-links-module-ExpenseCategoryModule-2a2525490c2c178b1607f54abc2344b185654c6d65baf33452f3131247e7456d7488a1819690a52faad492b30228788ee2e13d99f886e935ec35d4684744b955"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ExpenseCategoryModule-2a2525490c2c178b1607f54abc2344b185654c6d65baf33452f3131247e7456d7488a1819690a52faad492b30228788ee2e13d99f886e935ec35d4684744b955"' :
                                            'id="xs-controllers-links-module-ExpenseCategoryModule-2a2525490c2c178b1607f54abc2344b185654c6d65baf33452f3131247e7456d7488a1819690a52faad492b30228788ee2e13d99f886e935ec35d4684744b955"' }>
                                            <li class="link">
                                                <a href="controllers/ExpenseCategoryController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExpenseCategoryController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ExpenseCategoryModule-2a2525490c2c178b1607f54abc2344b185654c6d65baf33452f3131247e7456d7488a1819690a52faad492b30228788ee2e13d99f886e935ec35d4684744b955"' : 'data-bs-target="#xs-injectables-links-module-ExpenseCategoryModule-2a2525490c2c178b1607f54abc2344b185654c6d65baf33452f3131247e7456d7488a1819690a52faad492b30228788ee2e13d99f886e935ec35d4684744b955"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ExpenseCategoryModule-2a2525490c2c178b1607f54abc2344b185654c6d65baf33452f3131247e7456d7488a1819690a52faad492b30228788ee2e13d99f886e935ec35d4684744b955"' :
                                        'id="xs-injectables-links-module-ExpenseCategoryModule-2a2525490c2c178b1607f54abc2344b185654c6d65baf33452f3131247e7456d7488a1819690a52faad492b30228788ee2e13d99f886e935ec35d4684744b955"' }>
                                        <li class="link">
                                            <a href="injectables/ExpenseCategoryService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExpenseCategoryService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ExpensesModule.html" data-type="entity-link" >ExpensesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ExpensesModule-fe1b470debcb0a6eb3584d975b4af3546143daee54defb7106a37c5db738a40de96a16cecb19b04c6914ffda2a2909062b155984616ca57bdd551bde1604097e"' : 'data-bs-target="#xs-controllers-links-module-ExpensesModule-fe1b470debcb0a6eb3584d975b4af3546143daee54defb7106a37c5db738a40de96a16cecb19b04c6914ffda2a2909062b155984616ca57bdd551bde1604097e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ExpensesModule-fe1b470debcb0a6eb3584d975b4af3546143daee54defb7106a37c5db738a40de96a16cecb19b04c6914ffda2a2909062b155984616ca57bdd551bde1604097e"' :
                                            'id="xs-controllers-links-module-ExpensesModule-fe1b470debcb0a6eb3584d975b4af3546143daee54defb7106a37c5db738a40de96a16cecb19b04c6914ffda2a2909062b155984616ca57bdd551bde1604097e"' }>
                                            <li class="link">
                                                <a href="controllers/ExpensesController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExpensesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ExpensesModule-fe1b470debcb0a6eb3584d975b4af3546143daee54defb7106a37c5db738a40de96a16cecb19b04c6914ffda2a2909062b155984616ca57bdd551bde1604097e"' : 'data-bs-target="#xs-injectables-links-module-ExpensesModule-fe1b470debcb0a6eb3584d975b4af3546143daee54defb7106a37c5db738a40de96a16cecb19b04c6914ffda2a2909062b155984616ca57bdd551bde1604097e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ExpensesModule-fe1b470debcb0a6eb3584d975b4af3546143daee54defb7106a37c5db738a40de96a16cecb19b04c6914ffda2a2909062b155984616ca57bdd551bde1604097e"' :
                                        'id="xs-injectables-links-module-ExpensesModule-fe1b470debcb0a6eb3584d975b4af3546143daee54defb7106a37c5db738a40de96a16cecb19b04c6914ffda2a2909062b155984616ca57bdd551bde1604097e"' }>
                                        <li class="link">
                                            <a href="injectables/ExpensesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExpensesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MilestonesModule.html" data-type="entity-link" >MilestonesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-MilestonesModule-eef930e7ba10bcef246626d33c15ebd2c39d49593c827ed5726b1fe549394e66e63d3f300eb823f2193a39d5a8aa2f0edea176cf22cd9fa111400eac684b046b"' : 'data-bs-target="#xs-controllers-links-module-MilestonesModule-eef930e7ba10bcef246626d33c15ebd2c39d49593c827ed5726b1fe549394e66e63d3f300eb823f2193a39d5a8aa2f0edea176cf22cd9fa111400eac684b046b"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-MilestonesModule-eef930e7ba10bcef246626d33c15ebd2c39d49593c827ed5726b1fe549394e66e63d3f300eb823f2193a39d5a8aa2f0edea176cf22cd9fa111400eac684b046b"' :
                                            'id="xs-controllers-links-module-MilestonesModule-eef930e7ba10bcef246626d33c15ebd2c39d49593c827ed5726b1fe549394e66e63d3f300eb823f2193a39d5a8aa2f0edea176cf22cd9fa111400eac684b046b"' }>
                                            <li class="link">
                                                <a href="controllers/MilestonesController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MilestonesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-MilestonesModule-eef930e7ba10bcef246626d33c15ebd2c39d49593c827ed5726b1fe549394e66e63d3f300eb823f2193a39d5a8aa2f0edea176cf22cd9fa111400eac684b046b"' : 'data-bs-target="#xs-injectables-links-module-MilestonesModule-eef930e7ba10bcef246626d33c15ebd2c39d49593c827ed5726b1fe549394e66e63d3f300eb823f2193a39d5a8aa2f0edea176cf22cd9fa111400eac684b046b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MilestonesModule-eef930e7ba10bcef246626d33c15ebd2c39d49593c827ed5726b1fe549394e66e63d3f300eb823f2193a39d5a8aa2f0edea176cf22cd9fa111400eac684b046b"' :
                                        'id="xs-injectables-links-module-MilestonesModule-eef930e7ba10bcef246626d33c15ebd2c39d49593c827ed5726b1fe549394e66e63d3f300eb823f2193a39d5a8aa2f0edea176cf22cd9fa111400eac684b046b"' }>
                                        <li class="link">
                                            <a href="injectables/MilestonesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MilestonesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PrismaModule.html" data-type="entity-link" >PrismaModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-PrismaModule-f666a30f799db7e0c44b7b9d2fbb2eaf274bef0065ad38e81bf6e2ad8536150a34abe811c2e31ea516a418794c1cb79fc34c7089d490e3f4f0e2df8aac229e50"' : 'data-bs-target="#xs-injectables-links-module-PrismaModule-f666a30f799db7e0c44b7b9d2fbb2eaf274bef0065ad38e81bf6e2ad8536150a34abe811c2e31ea516a418794c1cb79fc34c7089d490e3f4f0e2df8aac229e50"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PrismaModule-f666a30f799db7e0c44b7b9d2fbb2eaf274bef0065ad38e81bf6e2ad8536150a34abe811c2e31ea516a418794c1cb79fc34c7089d490e3f4f0e2df8aac229e50"' :
                                        'id="xs-injectables-links-module-PrismaModule-f666a30f799db7e0c44b7b9d2fbb2eaf274bef0065ad38e81bf6e2ad8536150a34abe811c2e31ea516a418794c1cb79fc34c7089d490e3f4f0e2df8aac229e50"' }>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProductsModule.html" data-type="entity-link" >ProductsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ProductsModule-0815ce604cf7bb8d3ca0ae99be90d70ae87a81d8b20a34bbcc8c95f46c2e705a49cfd6e27cf8b2206ee3f38451aab0665a0ead2c3a870a1be8abced597bfecbb"' : 'data-bs-target="#xs-controllers-links-module-ProductsModule-0815ce604cf7bb8d3ca0ae99be90d70ae87a81d8b20a34bbcc8c95f46c2e705a49cfd6e27cf8b2206ee3f38451aab0665a0ead2c3a870a1be8abced597bfecbb"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProductsModule-0815ce604cf7bb8d3ca0ae99be90d70ae87a81d8b20a34bbcc8c95f46c2e705a49cfd6e27cf8b2206ee3f38451aab0665a0ead2c3a870a1be8abced597bfecbb"' :
                                            'id="xs-controllers-links-module-ProductsModule-0815ce604cf7bb8d3ca0ae99be90d70ae87a81d8b20a34bbcc8c95f46c2e705a49cfd6e27cf8b2206ee3f38451aab0665a0ead2c3a870a1be8abced597bfecbb"' }>
                                            <li class="link">
                                                <a href="controllers/ProductsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ProductsModule-0815ce604cf7bb8d3ca0ae99be90d70ae87a81d8b20a34bbcc8c95f46c2e705a49cfd6e27cf8b2206ee3f38451aab0665a0ead2c3a870a1be8abced597bfecbb"' : 'data-bs-target="#xs-injectables-links-module-ProductsModule-0815ce604cf7bb8d3ca0ae99be90d70ae87a81d8b20a34bbcc8c95f46c2e705a49cfd6e27cf8b2206ee3f38451aab0665a0ead2c3a870a1be8abced597bfecbb"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProductsModule-0815ce604cf7bb8d3ca0ae99be90d70ae87a81d8b20a34bbcc8c95f46c2e705a49cfd6e27cf8b2206ee3f38451aab0665a0ead2c3a870a1be8abced597bfecbb"' :
                                        'id="xs-injectables-links-module-ProductsModule-0815ce604cf7bb8d3ca0ae99be90d70ae87a81d8b20a34bbcc8c95f46c2e705a49cfd6e27cf8b2206ee3f38451aab0665a0ead2c3a870a1be8abced597bfecbb"' }>
                                        <li class="link">
                                            <a href="injectables/ProductsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProjectsModule.html" data-type="entity-link" >ProjectsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ProjectsModule-c8cda0def628f26100f2eb4ffc00b183959a5fab722597a411a58f52133d9101158ba95df38b3ce1215b80f47175e161ee31a9e40615e1fc5703fe2c498b0d4b"' : 'data-bs-target="#xs-controllers-links-module-ProjectsModule-c8cda0def628f26100f2eb4ffc00b183959a5fab722597a411a58f52133d9101158ba95df38b3ce1215b80f47175e161ee31a9e40615e1fc5703fe2c498b0d4b"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProjectsModule-c8cda0def628f26100f2eb4ffc00b183959a5fab722597a411a58f52133d9101158ba95df38b3ce1215b80f47175e161ee31a9e40615e1fc5703fe2c498b0d4b"' :
                                            'id="xs-controllers-links-module-ProjectsModule-c8cda0def628f26100f2eb4ffc00b183959a5fab722597a411a58f52133d9101158ba95df38b3ce1215b80f47175e161ee31a9e40615e1fc5703fe2c498b0d4b"' }>
                                            <li class="link">
                                                <a href="controllers/ProjectsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ProjectsModule-c8cda0def628f26100f2eb4ffc00b183959a5fab722597a411a58f52133d9101158ba95df38b3ce1215b80f47175e161ee31a9e40615e1fc5703fe2c498b0d4b"' : 'data-bs-target="#xs-injectables-links-module-ProjectsModule-c8cda0def628f26100f2eb4ffc00b183959a5fab722597a411a58f52133d9101158ba95df38b3ce1215b80f47175e161ee31a9e40615e1fc5703fe2c498b0d4b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProjectsModule-c8cda0def628f26100f2eb4ffc00b183959a5fab722597a411a58f52133d9101158ba95df38b3ce1215b80f47175e161ee31a9e40615e1fc5703fe2c498b0d4b"' :
                                        'id="xs-injectables-links-module-ProjectsModule-c8cda0def628f26100f2eb4ffc00b183959a5fab722597a411a58f52133d9101158ba95df38b3ce1215b80f47175e161ee31a9e40615e1fc5703fe2c498b0d4b"' }>
                                        <li class="link">
                                            <a href="injectables/ProjectsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UsersModule-0c25af90710147f0fbfed25bf3dc5d48b700579ec6bd88f07e2d01fef5f9cfa5462754756d2b80ef704cf1f8ca45a194d7d3ab37805b0eaf29e08b35aff1cab8"' : 'data-bs-target="#xs-controllers-links-module-UsersModule-0c25af90710147f0fbfed25bf3dc5d48b700579ec6bd88f07e2d01fef5f9cfa5462754756d2b80ef704cf1f8ca45a194d7d3ab37805b0eaf29e08b35aff1cab8"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-0c25af90710147f0fbfed25bf3dc5d48b700579ec6bd88f07e2d01fef5f9cfa5462754756d2b80ef704cf1f8ca45a194d7d3ab37805b0eaf29e08b35aff1cab8"' :
                                            'id="xs-controllers-links-module-UsersModule-0c25af90710147f0fbfed25bf3dc5d48b700579ec6bd88f07e2d01fef5f9cfa5462754756d2b80ef704cf1f8ca45a194d7d3ab37805b0eaf29e08b35aff1cab8"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UsersModule-0c25af90710147f0fbfed25bf3dc5d48b700579ec6bd88f07e2d01fef5f9cfa5462754756d2b80ef704cf1f8ca45a194d7d3ab37805b0eaf29e08b35aff1cab8"' : 'data-bs-target="#xs-injectables-links-module-UsersModule-0c25af90710147f0fbfed25bf3dc5d48b700579ec6bd88f07e2d01fef5f9cfa5462754756d2b80ef704cf1f8ca45a194d7d3ab37805b0eaf29e08b35aff1cab8"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-0c25af90710147f0fbfed25bf3dc5d48b700579ec6bd88f07e2d01fef5f9cfa5462754756d2b80ef704cf1f8ca45a194d7d3ab37805b0eaf29e08b35aff1cab8"' :
                                        'id="xs-injectables-links-module-UsersModule-0c25af90710147f0fbfed25bf3dc5d48b700579ec6bd88f07e2d01fef5f9cfa5462754756d2b80ef704cf1f8ca45a194d7d3ab37805b0eaf29e08b35aff1cab8"' }>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AppController.html" data-type="entity-link" >AppController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link" >AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/DepartmentsController.html" data-type="entity-link" >DepartmentsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ExpenseCategoryController.html" data-type="entity-link" >ExpenseCategoryController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ExpensesController.html" data-type="entity-link" >ExpensesController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/MilestonesController.html" data-type="entity-link" >MilestonesController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ProductsController.html" data-type="entity-link" >ProductsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ProjectsController.html" data-type="entity-link" >ProjectsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UsersController.html" data-type="entity-link" >UsersController</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AssignTaskDto.html" data-type="entity-link" >AssignTaskDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AssignTaskDto-1.html" data-type="entity-link" >AssignTaskDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AssignTaskResponseDto.html" data-type="entity-link" >AssignTaskResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CostAllocationDto.html" data-type="entity-link" >CostAllocationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateExpenseDto.html" data-type="entity-link" >CreateExpenseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateMilestoneDto.html" data-type="entity-link" >CreateMilestoneDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProductDto.html" data-type="entity-link" >CreateProductDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProjectWithAllocationsDto.html" data-type="entity-link" >CreateProjectWithAllocationsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DashboardCountsDto.html" data-type="entity-link" >DashboardCountsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteUserResponseDto.html" data-type="entity-link" >DeleteUserResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDto.html" data-type="entity-link" >LoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterDto.html" data-type="entity-link" >RegisterDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TaskDto.html" data-type="entity-link" >TaskDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TaskInput.html" data-type="entity-link" >TaskInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/TaskNameDto.html" data-type="entity-link" >TaskNameDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TaskProjectDto.html" data-type="entity-link" >TaskProjectDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TaskStatusCountDto.html" data-type="entity-link" >TaskStatusCountDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TaskStatusCountsDto.html" data-type="entity-link" >TaskStatusCountsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateExpenseDto.html" data-type="entity-link" >UpdateExpenseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateMilestoneDto.html" data-type="entity-link" >UpdateMilestoneDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProductDto.html" data-type="entity-link" >UpdateProductDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProjectDto.html" data-type="entity-link" >UpdateProjectDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateTaskStatusDto.html" data-type="entity-link" >UpdateTaskStatusDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link" >UpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserResponseDto.html" data-type="entity-link" >UserResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ViewAssignedTaskResponseDto.html" data-type="entity-link" >ViewAssignedTaskResponseDto</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AppService.html" data-type="entity-link" >AppService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DepartmentsService.html" data-type="entity-link" >DepartmentsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExpenseCategoryService.html" data-type="entity-link" >ExpenseCategoryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExpensesService.html" data-type="entity-link" >ExpensesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link" >JwtAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtStrategy.html" data-type="entity-link" >JwtStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MilestonesService.html" data-type="entity-link" >MilestonesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PrismaService.html" data-type="entity-link" >PrismaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProductsService.html" data-type="entity-link" >ProductsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProjectsService.html" data-type="entity-link" >ProjectsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersService.html" data-type="entity-link" >UsersService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});