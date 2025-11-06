import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { VoucherService } from '../../demo/service/VoucherService';

const Voucher = () => {
    let emptyVoucher = {
        id: null,
        name: '',
        discount: 0,
        quantity: 0,
        validity_period: '',
        conditional: '',
        description: ''
    };

    const [vouchers, setVouchers] = useState([]);
    const [voucherDialog, setVoucherDialog] = useState(false);
    const [deleteVoucherDialog, setDeleteVoucherDialog] = useState(false);
    const [deleteVouchersDialog, setDeleteVouchersDialog] = useState(false);
    const [voucher, setVoucher] = useState(emptyVoucher);
    const [selectedVouchers, setSelectedVouchers] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const voucherService = new VoucherService();

    useEffect(() => {
        voucherService.getVouchers().then((data) => {
            console.log('Danh sách voucher:', data); // Debug dữ liệu từ API
            setVouchers(data);
        }).catch((error) => {
            console.error('Lỗi khi lấy danh sách:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách voucher', life: 3000 });
        });
    }, []);

    const openNew = () => {
        setVoucher(emptyVoucher);
        setSubmitted(false);
        setVoucherDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setVoucherDialog(false);
    };

    const hideDeleteVoucherDialog = () => {
        setDeleteVoucherDialog(false);
    };

    const hideDeleteVouchersDialog = () => {
        setDeleteVouchersDialog(false);
    };

    const saveVoucher = async () => {
        setSubmitted(true);

        if (voucher.name.trim() && voucher.discount > 0 && voucher.quantity >= 0) { // Kiểm tra các trường bắt buộc
            try {
                if (voucher.id) { // Cập nhật
                    console.log('Cập nhật voucher:', voucher);
                    await voucherService.updateVoucher(voucher);
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã cập nhật voucher', life: 3000 });
                } else { // Tạo mới
                    console.log('Tạo voucher mới:', voucher);
                    const newVoucher = { ...voucher }; // Không gửi id khi tạo mới
                    await voucherService.createVoucher(newVoucher);
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã tạo voucher', life: 3000 });
                }
                const updatedVouchers = await voucherService.getVouchers();
                setVouchers(updatedVouchers);
                setVoucherDialog(false);
                setVoucher(emptyVoucher);
            } catch (error) {
                console.error('Lỗi khi lưu voucher:', error);
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: error.message || 'Không thể lưu voucher', life: 3000 });
            }
        }
    };

    const editVoucher = (voucher) => {
        setVoucher({ ...voucher });
        setVoucherDialog(true);
    };

    const confirmDeleteVoucher = (voucher) => {
        setVoucher(voucher);
        setDeleteVoucherDialog(true);
    };

    const deleteVoucher = async () => {
        try {
            console.log('Xóa voucher với ID:', voucher.id); // Debug ID
            await voucherService.deleteVoucher(voucher.id);
            const updatedVouchers = await voucherService.getVouchers();
            setVouchers(updatedVouchers);
            setDeleteVoucherDialog(false);
            setVoucher(emptyVoucher);
            toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa voucher', life: 3000 });
        } catch (error) {
            console.error('Lỗi khi xóa:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa voucher', life: 3000 });
        }
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteVouchersDialog(true);
    };

    const deleteSelectedVouchers = async () => {
        try {
            const deletePromises = selectedVouchers.map((v) => voucherService.deleteVoucher(v.id));
            await Promise.all(deletePromises);
            const updatedVouchers = await voucherService.getVouchers();
            setVouchers(updatedVouchers);
            setDeleteVouchersDialog(false);
            setSelectedVouchers(null);
            toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa các voucher đã chọn', life: 3000 });
        } catch (error) {
            console.error('Lỗi khi xóa nhiều voucher:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa các voucher', life: 3000 });
        }
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        setVoucher((prevVoucher) => ({ ...prevVoucher, [name]: val }));
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        setVoucher((prevVoucher) => ({ ...prevVoucher, [name]: val }));
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="my-2">
                <Button label="Thêm mới" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
                <Button label="Xóa" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedVouchers || !selectedVouchers.length} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <Button label="Xuất CSV" icon="pi pi-upload" severity="help" onClick={exportCSV} />
        );
    };

    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Mã</span>
                {rowData.id}
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

    const discountBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Giảm giá</span>
                {rowData.discount}%
            </>
        );
    };

    const quantityBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Số lượng</span>
                {rowData.quantity}
            </>
        );
    };

    const validityPeriodBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Hạn sử dụng</span>
                {rowData.validity_period}
            </>
        );
    };

    const conditionalBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Điều kiện</span>
                {rowData.conditional}
            </>
        );
    };

    const descriptionBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Mô tả</span>
                {rowData.description}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" severity="success" rounded className="mr-2" onClick={() => editVoucher(rowData)} />
                <Button icon="pi pi-trash" severity="warning" rounded onClick={() => confirmDeleteVoucher(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Quản lý voucher</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Tìm kiếm..." />
            </span>
        </div>
    );

    const voucherDialogFooter = (
        <>
            <Button label="Hủy" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Lưu" icon="pi pi-check" text onClick={saveVoucher} />
        </>
    );

    const deleteVoucherDialogFooter = (
        <>
            <Button label="Không" icon="pi pi-times" text onClick={hideDeleteVoucherDialog} />
            <Button label="Có" icon="pi pi-check" text onClick={deleteVoucher} />
        </>
    );

    const deleteVouchersDialogFooter = (
        <>
            <Button label="Không" icon="pi pi-times" text onClick={hideDeleteVouchersDialog} />
            <Button label="Có" icon="pi pi-check" text onClick={deleteSelectedVouchers} />
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
                        value={vouchers}
                        selection={selectedVouchers}
                        onSelectionChange={(e) => setSelectedVouchers(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Hiển thị {first} đến {last} của {totalRecords} voucher"
                        globalFilter={globalFilter}
                        emptyMessage="Không tìm thấy voucher."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Mã" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="name" header="Tên" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="discount" header="Giảm giá" sortable body={discountBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="quantity" header="Số lượng" sortable body={quantityBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="validity_period" header="Hạn sử dụng" sortable body={validityPeriodBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="conditional" header="Điều kiện" body={conditionalBodyTemplate} headerStyle={{ minWidth: '12rem' }}></Column>
                        <Column field="description" header="Mô tả" body={descriptionBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={voucherDialog} style={{ width: '450px' }} header="Chi tiết voucher" modal className="p-fluid" footer={voucherDialogFooter} onHide={hideDialog}>
                        {voucher.id && (
                            <div className="field">
                                <label htmlFor="id">Mã voucher</label>
                                <InputText id="id" value={voucher.id} disabled />
                            </div>
                        )}
                        <div className="field">
                            <label htmlFor="name">Tên voucher</label>
                            <InputText
                                id="name"
                                value={voucher.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus={!voucher.id}
                                className={classNames({ 'p-invalid': submitted && !voucher.name })}
                            />
                            {submitted && !voucher.name && <small className="p-invalid">Tên voucher là bắt buộc.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="discount">Giảm giá (%)</label>
                            <InputNumber
                                id="discount"
                                value={voucher.discount}
                                onValueChange={(e) => onInputNumberChange(e, 'discount')}
                                min={0}
                                max={100}
                                required
                                className={classNames({ 'p-invalid': submitted && voucher.discount <= 0 })}
                            />
                            {submitted && voucher.discount <= 0 && <small className="p-invalid">Giảm giá phải lớn hơn 0.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="quantity">Số lượng</label>
                            <InputNumber
                                id="quantity"
                                value={voucher.quantity}
                                onValueChange={(e) => onInputNumberChange(e, 'quantity')}
                                min={0}
                                required
                            />
                            {submitted && voucher.quantity < 0 && <small className="p-invalid">Số lượng không được âm.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="validity_period">Hạn sử dụng</label>
                            <InputText
                                id="validity_period"
                                value={voucher.validity_period}
                                onChange={(e) => onInputChange(e, 'validity_period')}
                                placeholder="DD/MM/YYYY"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="conditional">Điều kiện</label>
                            <InputText
                                id="conditional"
                                value={voucher.conditional}
                                onChange={(e) => onInputChange(e, 'conditional')}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="description">Mô tả</label>
                            <InputTextarea
                                id="description"
                                value={voucher.description || ''}
                                onChange={(e) => onInputChange(e, 'description')}
                                rows={3}
                                cols={20}
                            />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteVoucherDialog} style={{ width: '450px' }} header="Xác nhận" modal footer={deleteVoucherDialogFooter} onHide={hideDeleteVoucherDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {voucher && (
                                <span>
                                    Bạn có chắc chắn muốn xóa voucher <b>{voucher.name}</b> không?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteVouchersDialog} style={{ width: '450px' }} header="Xác nhận" modal footer={deleteVouchersDialogFooter} onHide={hideDeleteVouchersDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>Bạn có chắc chắn muốn xóa các voucher đã chọn không?</span>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Voucher;