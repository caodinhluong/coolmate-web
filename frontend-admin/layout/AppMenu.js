import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model = [
        {
            label: 'DASHBOARD',
            items: [
                { label: 'Home', icon: 'pi pi-fw pi-home', to: '/' },
                { label: 'Category', icon: 'pi pi-fw pi-bars', to: '/category', badge: 'NEW' },
                { label: 'Product', icon: 'pi pi-fw pi-box', to: '/product' },
                { label: 'Feedback', icon: 'pi pi-fw pi-comments', to: '/feedback' },
                { label: 'Supplier', icon: 'pi pi-fw pi-truck', to: '/supplier' },
                { label: 'User', icon: 'pi pi-fw pi-user', to: '/user' },
                { label: 'Sale', icon: 'pi pi-fw pi-percentage', to: '/sale' },
                { label: 'Voucher', icon: 'pi pi-fw pi-money-bill', to: '/voucher' },
                { label: 'Order', icon: 'pi pi-fw pi-book', to: '/order' },
                { label: 'Import Invoice', icon: 'pi pi-fw pi-building', to: '/import_invoice' },
            ],
        },
        {
            label: 'Utilities',
            items: [
                { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', to: '/utilities/icons' },
            ],
        },
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => (
                    !item.seperator ? (
                        <AppMenuitem item={item} root={true} index={i} key={item.label} />
                    ) : (
                        <li className="menu-separator" key={`separator-${i}`}></li>
                    )
                ))}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;