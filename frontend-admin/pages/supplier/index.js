import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { SupplierService } from '../../demo/service/SupplierService';

const Supplier = () => {
    let emptySupplier = {
        id: null,
        name: '',
        contact_name: '',
        phone: '',
        email: '',
        address: '',
        created_at: null // Để backend tự xử lý
    };

    const [suppliers, setSuppliers] = useState([]);
    const [supplierDialog, setSupplierDialog] = useState(false);
    const [deleteSupplierDialog, setDeleteSupplierDialog] = useState(false);
    const [deleteSuppliersDialog, setDeleteSuppliersDialog] = useState(false);
    const [supplier, setSupplier] = useState(emptySupplier);
    const [selectedSuppliers, setSelectedSuppliers] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const supplierService = new SupplierService();

    useEffect(() => {
        supplierService.getSuppliers()
            .then((data) => {
                console.log('Danh sách nhà cung cấp:', data);
                setSuppliers(data);
            })
            .catch((error) => {
                console.error('Lỗi khi lấy danh sách nhà cung cấp:', error);
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách nhà cung cấp', life: 3000 });
            });
    }, []);

    const openNew = () => {
        setSupplier(emptySupplier);
        setSubmitted(false);
        setSupplierDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setSupplierDialog(false);
    };

    const hideDeleteSupplierDialog = () => {
        setDeleteSupplierDialog(false);
    };

    const hideDeleteSuppliersDialog = () => {
        setDeleteSuppliersDialog(false);
    };

    const saveSupplier = async () => {
        setSubmitted(true);

        if (supplier.name.trim() && supplier.phone.trim() && supplier.address.trim()) {
            try {
                if (supplier.id) {
                    console.log('Cập nhật nhà cung cấp:', supplier);
                    await supplierService.updateSupplier(supplier);
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã cập nhật nhà cung cấp', life: 3000 });
                } else {
                    console.log('Tạo nhà cung cấp mới:', supplier);
                    const newSupplier = {
                        name: supplier.name,
                        contact_name: supplier.contact_name,
                        phone: supplier.phone,
                        email: supplier.email,
                        address: supplier.address
                    };
                    await supplierService.createSupplier(newSupplier);
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã tạo nhà cung cấp', life: 3000 });
                }
                const updatedSuppliers = await supplierService.getSuppliers();
                setSuppliers(updatedSuppliers);
                setSupplierDialog(false);
                setSupplier(emptySupplier);
            } catch (error) {
                console.error('Lỗi khi lưu nhà cung cấp:', error);
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: error.message || 'Không thể lưu nhà cung cấp', life: 3000 });
            }
        }
    };

    const editSupplier = (supplier) => {
        setSupplier({ ...supplier });
        setSupplierDialog(true);
    };

    const confirmDeleteSupplier = (supplier) => {
        setSupplier(supplier);
        setDeleteSupplierDialog(true);
    };

    const deleteSupplier = async () => {
        try {
            console.log('Xóa nhà cung cấp với ID:', supplier.id);
            await supplierService.deleteSupplier(supplier.id);
            const updatedSuppliers = await supplierService.getSuppliers();
            setSuppliers(updatedSuppliers);
            setDeleteSupplierDialog(false);
            setSupplier(emptySupplier);
            toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa nhà cung cấp', life: 3000 });
        } catch (error) {
            console.error('Lỗi khi xóa nhà cung cấp:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa nhà cung cấp', life: 3000 });
        }
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteSuppliersDialog(true);
    };

    const deleteSelectedSuppliers = async () => {
        try {
            const deletePromises = selectedSuppliers.map((sup) => supplierService.deleteSupplier(sup.id));
            await Promise.all(deletePromises);
            const updatedSuppliers = await supplierService.getSuppliers();
            setSuppliers(updatedSuppliers);
            setDeleteSuppliersDialog(false);
            setSelectedSuppliers(null);
            toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa các nhà cung cấp đã chọn', life: 3000 });
        } catch (error) {
            console.error('Lỗi khi xóa nhiều nhà cung cấp:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa các nhà cung cấp', life: 3000 });
        }
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        setSupplier((prev) => ({ ...prev, [name]: val }));
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="my-2">
                <Button label="Thêm mới" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
                <Button label="Xóa" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedSuppliers || !selectedSuppliers.length} />
            </div>
        );
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

    const contactNameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Người liên hệ</span>
                {rowData.contact_name || 'Không có'}
            </>
        );
    };

    const phoneBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Số điện thoại</span>
                {rowData.phone}
            </>
        );
    };

    const emailBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Email</span>
                {rowData.email || 'Không có'}
            </>
        );
    };

    const addressBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Địa chỉ</span>
                {rowData.address}
            </>
        );
    };

    const createdAtBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Ngày tạo</span>
                {rowData.created_at ? new Date(rowData.created_at).toLocaleString('vi-VN') : 'Không có'}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" severity="success" rounded className="mr-2" onClick={() => editSupplier(rowData)} />
                <Button icon="pi pi-trash" severity="warning" rounded onClick={() => confirmDeleteSupplier(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Quản lý nhà cung cấp</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Tìm kiếm..." />
            </span>
        </div>
    );

    const supplierDialogFooter = (
        <>
            <Button label="Hủy" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Lưu" icon="pi pi-check" text onClick={saveSupplier} />
        </>
    );

    const deleteSupplierDialogFooter = (
        <>
            <Button label="Không" icon="pi pi-times" text onClick={hideDeleteSupplierDialog} />
            <Button label="Có" icon="pi pi-check" text onClick={deleteSupplier} />
        </>
    );

    const deleteSuppliersDialogFooter = (
        <>
            <Button label="Không" icon="pi pi-times" text onClick={hideDeleteSuppliersDialog} />
            <Button label="Có" icon="pi pi-check" text onClick={deleteSelectedSuppliers} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={suppliers}
                        selection={selectedSuppliers}
                        onSelectionChange={(e) => setSelectedSuppliers(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Hiển thị {first} đến {last} của {totalRecords} nhà cung cấp"
                        globalFilter={globalFilter}
                        emptyMessage="Không tìm thấy nhà cung cấp."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column header="STT" sortable body={sttBodyTemplate} headerStyle={{ minWidth: '2rem' }}></Column>
                        <Column field="name" header="Tên" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="contact_name" header="Người liên hệ" sortable body={contactNameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="phone" header="Số điện thoại" sortable body={phoneBodyTemplate} headerStyle={{ minWidth: '12rem' }}></Column>
                        <Column field="email" header="Email" sortable body={emailBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="address" header="Địa chỉ" sortable body={addressBodyTemplate} headerStyle={{ minWidth: '20rem' }}></Column>
                        <Column field="created_at" header="Ngày tạo" sortable body={createdAtBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={supplierDialog} style={{ width: '450px' }} header="Chi tiết nhà cung cấp" modal className="p-fluid" footer={supplierDialogFooter} onHide={hideDialog}>
                        {supplier.id && (
                            <div className="field">
                                <label htmlFor="id">Mã nhà cung cấp</label>
                                <InputText id="id" value={supplier.id} disabled />
                            </div>
                        )}
                        <div className="field">
                            <label htmlFor="name">Tên nhà cung cấp</label>
                            <InputText
                                id="name"
                                value={supplier.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus={!supplier.id}
                                className={classNames({ 'p-invalid': submitted && !supplier.name })}
                            />
                            {submitted && !supplier.name && <small className="p-invalid">Tên nhà cung cấp là bắt buộc.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="contact_name">Người liên hệ</label>
                            <InputText
                                id="contact_name"
                                value={supplier.contact_name || ''}
                                onChange={(e) => onInputChange(e, 'contact_name')}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="phone">Số điện thoại</label>
                            <InputText
                                id="phone"
                                value={supplier.phone}
                                onChange={(e) => onInputChange(e, 'phone')}
                                required
                                className={classNames({ 'p-invalid': submitted && !supplier.phone })}
                            />
                            {submitted && !supplier.phone && <small className="p-invalid">Số điện thoại là bắt buộc.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <InputText
                                id="email"
                                value={supplier.email || ''}
                                onChange={(e) => onInputChange(e, 'email')}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="address">Địa chỉ</label>
                            <InputText
                                id="address"
                                value={supplier.address}
                                onChange={(e) => onInputChange(e, 'address')}
                                required
                                className={classNames({ 'p-invalid': submitted && !supplier.address })}
                            />
                            {submitted && !supplier.address && <small className="p-invalid">Địa chỉ là bắt buộc.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteSupplierDialog} style={{ width: '450px' }} header="Xác nhận" modal footer={deleteSupplierDialogFooter} onHide={hideDeleteSupplierDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {supplier && (
                                <span>Bạn có chắc chắn muốn xóa nhà cung cấp <b>{supplier.name}</b> không?</span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteSuppliersDialog} style={{ width: '450px' }} header="Xác nhận" modal footer={deleteSuppliersDialogFooter} onHide={hideDeleteSuppliersDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>Bạn có chắc chắn muốn xóa các nhà cung cấp đã chọn không?</span>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Supplier;