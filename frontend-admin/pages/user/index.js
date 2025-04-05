import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import React, { useEffect, useRef, useState } from 'react';
import { UserService } from '../../demo/service/UserService';

const User = () => {
    const [users, setUsers] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const userService = new UserService();

    useEffect(() => {
        userService.getUsers()
            .then((data) => {
                console.log('Danh sách người dùng:', data);
                setUsers(data);
            })
            .catch((error) => {
                console.error('Lỗi khi lấy danh sách người dùng:', error);
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách người dùng', life: 3000 });
            });
    }, []);

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const rightToolbarTemplate = () => {
        return (
            <Button label="Xuất CSV" icon="pi pi-upload" severity="help" onClick={exportCSV} />
        );
    };

    const sttBodyTemplate = (rowData, { rowIndex }) => {
        return (
            <>
                <span className="p-column-title">STT</span>
                {rowIndex + 1}
            </>
        );
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Tên</span>
                {rowData.name}
            </>
        );
    };

    const emailBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Email</span>
                {rowData.email}
            </>
        );
    };

    const phoneBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Số điện thoại</span>
                {rowData.phone || 'Không có'}
            </>
        );
    };

    const addressBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Địa chỉ</span>
                {rowData.address || 'Không có'}
            </>
        );
    };

    const roleBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Vai trò</span>
                {rowData.role === 'customer' ? 'Khách hàng' : 'Quản trị viên'}
            </>
        );
    };

    const avtUrlBodyTemplate = (rowData) => {
        const imagePath = rowData.avt_url ? `/images/${rowData.avt_url}` : null;
        return (
            <>
                <span className="p-column-title">Ảnh đại diện</span>
                {imagePath ? (
                    <img src={imagePath} alt="Avatar" style={{ width: '60px', height: '80px' }} />
                ) : (
                    'Không có'
                )}
            </>
        );
    };

    const genderBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Giới tính</span>
                {rowData.gender || 'Không có'}
            </>
        );
    };

    const usernameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Tên đăng nhập</span>
                {rowData.username}
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Danh sách người dùng</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Tìm kiếm..." />
            </span>
        </div>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={users}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Hiển thị {first} đến {last} của {totalRecords} người dùng"
                        globalFilter={globalFilter}
                        emptyMessage="Không tìm thấy người dùng."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column header="STT" sortable body={sttBodyTemplate} headerStyle={{ minWidth: '2rem' }}></Column>
                        <Column field="name" header="Tên" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="email" header="Email" sortable body={emailBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="phone" header="Số điện thoại" sortable body={phoneBodyTemplate} headerStyle={{ minWidth: '12rem' }}></Column>
                        <Column field="address" header="Địa chỉ" sortable body={addressBodyTemplate} headerStyle={{ minWidth: '20rem' }}></Column>
                        <Column field="role" header="Vai trò" sortable body={roleBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="avt_url" header="Ảnh đại diện" body={avtUrlBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="gender" header="Giới tính" sortable body={genderBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="username" header="Tên đăng nhập" sortable body={usernameBodyTemplate} headerStyle={{ minWidth: '12rem' }}></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default User;