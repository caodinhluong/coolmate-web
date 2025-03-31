import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { CategoryService } from '../../service/CategoryService';

const Category = () => {
    let emptyCategory = {
        id: null,
        name: '',
        description: '',
    };

    const [categories, setCategories] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [categoryDialog, setCategoryDialog] = useState(false);
    const [deleteCategoryDialog, setDeleteCategoryDialog] = useState(false);
    const [deleteCategoriesDialog, setDeleteCategoriesDialog] = useState(false);
    const [category, setCategory] = useState(emptyCategory);
    const [selectedCategories, setSelectedCategories] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 1,
    });
    const toast = useRef(null);
    const dt = useRef(null);
    const categoryService = new CategoryService();

    useEffect(() => {
        loadCategories();
    }, [lazyParams]);

    const loadCategories = () => {
        const { rows, page } = lazyParams;
        categoryService
            .getCategories({ limit: rows, page })
            .then((result) => {
                console.log('Danh sách danh mục:', result);
                setCategories(result.data);
                setTotalRecords(result.meta.total);
            })
            .catch((error) => {
                console.error('Lỗi khi lấy danh sách:', error);
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách', life: 3000 });
            });
    };

    const openNew = () => {
        setCategory(emptyCategory);
        setSubmitted(false);
        setCategoryDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCategoryDialog(false);
    };

    const hideDeleteCategoryDialog = () => {
        setDeleteCategoryDialog(false);
    };

    const hideDeleteCategoriesDialog = () => {
        setDeleteCategoriesDialog(false);
    };

    const saveCategory = async () => {
        setSubmitted(true);

        if (category.name.trim()) {
            try {
                if (category.id) {
                    console.log('Cập nhật danh mục:', category);
                    await categoryService.updateCategory(category);
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã cập nhật danh mục', life: 3000 });
                } else {
                    console.log('Tạo danh mục mới:', category);
                    const newCategory = { name: category.name, description: category.description };
                    await categoryService.createCategory(newCategory);
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã tạo danh mục', life: 3000 });
                }
                loadCategories();
                setCategoryDialog(false);
                setCategory(emptyCategory);
            } catch (error) {
                console.error('Lỗi khi lưu danh mục:', error);
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: error.message || 'Không thể lưu danh mục', life: 3000 });
            }
        }
    };

    const editCategory = (category) => {
        setCategory({ ...category });
        setCategoryDialog(true);
    };

    const confirmDeleteCategory = (category) => {
        setCategory(category);
        setDeleteCategoryDialog(true);
    };

    const deleteCategory = async () => {
        try {
            console.log('Xóa danh mục với ID:', category.id);
            await categoryService.deleteCategory(category.id);
            loadCategories();
            setDeleteCategoryDialog(false);
            setCategory(emptyCategory);
            toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa danh mục', life: 3000 });
        } catch (error) {
            console.error('Lỗi khi xóa:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: error.message || 'Không thể xóa danh mục', life: 3000 });
        }
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteCategoriesDialog(true);
    };

    const deleteSelectedCategories = async () => {
        try {
            const deletePromises = selectedCategories.map((cat) => categoryService.deleteCategory(cat.id));
            await Promise.all(deletePromises);
            loadCategories();
            setDeleteCategoriesDialog(false);
            setSelectedCategories(null);
            toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa các danh mục đã chọn', life: 3000 });
        } catch (error) {
            console.error('Lỗi khi xóa nhiều danh mục:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa các danh mục', life: 3000 });
        }
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _category = { ...category };
        _category[`${name}`] = val;
        setCategory(_category);
    };

    const onPage = (event) => {
        setLazyParams({
            ...lazyParams,
            first: event.first,
            rows: event.rows,
            page: event.page + 1,
        });
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="my-2">
                <Button label="Thêm mới" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
                <Button label="Xóa" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedCategories || !selectedCategories.length} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <Button label="Xuất CSV" icon="pi pi-upload" severity="help" onClick={exportCSV} />
        );
    };

    const codeBodyTemplate = (rowData) => {
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

    const descriptionBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Mô tả</span>
                {rowData.description || ''}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" severity="success" rounded className="mr-2" onClick={() => editCategory(rowData)} />
                <Button icon="pi pi-trash" severity="warning" rounded onClick={() => confirmDeleteCategory(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Quản lý danh mục</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Tìm kiếm..." />
            </span>
        </div>
    );

    const categoryDialogFooter = (
        <>
            <Button label="Hủy" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Lưu" icon="pi pi-check" text onClick={saveCategory} />
        </>
    );

    const deleteCategoryDialogFooter = (
        <>
            <Button label="Không" icon="pi pi-times" text onClick={hideDeleteCategoryDialog} />
            <Button label="Có" icon="pi pi-check" text onClick={deleteCategory} />
        </>
    );

    const deleteCategoriesDialogFooter = (
        <>
            <Button label="Không" icon="pi pi-times" text onClick={hideDeleteCategoriesDialog} />
            <Button label="Có" icon="pi pi-check" text onClick={deleteSelectedCategories} />
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
                        value={categories}
                        selection={selectedCategories}
                        onSelectionChange={(e) => setSelectedCategories(e.value)}
                        dataKey="id"
                        paginator
                        rows={lazyParams.rows}
                        rowsPerPageOptions={[5, 10, 25]}
                        totalRecords={totalRecords}
                        lazy
                        onPage={onPage}
                        first={lazyParams.first}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Hiển thị {first} đến {last} của {totalRecords} danh mục"
                        globalFilter={globalFilter}
                        emptyMessage="Không tìm thấy danh mục."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Mã" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="name" header="Tên" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="description" header="Mô tả" body={descriptionBodyTemplate} headerStyle={{ minWidth: '20rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog
                        visible={categoryDialog}
                        style={{ width: '450px' }}
                        header="Chi tiết danh mục"
                        modal
                        className="p-fluid"
                        footer={categoryDialogFooter}
                        onHide={hideDialog}
                    >
                        {category.id && (
                            <div className="field">
                                <label htmlFor="id">Mã danh mục</label>
                                <InputText id="id" value={category.id} disabled />
                            </div>
                        )}
                        <div className="field">
                            <label htmlFor="name">Tên danh mục</label>
                            <InputText
                                id="name"
                                value={category.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus={!category.id}
                                className={classNames({ 'p-invalid': submitted && !category.name })}
                            />
                            {submitted && !category.name && <small className="p-invalid">Tên danh mục là bắt buộc.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Mô tả</label>
                            <InputTextarea
                                id="description"
                                value={category.description || ''}
                                onChange={(e) => onInputChange(e, 'description')}
                                rows={3}
                                cols={20}
                            />
                        </div>
                    </Dialog>

                    <Dialog
                        visible={deleteCategoryDialog}
                        style={{ width: '450px' }}
                        header="Xác nhận"
                        modal
                        footer={deleteCategoryDialogFooter}
                        onHide={hideDeleteCategoryDialog}
                    >
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {category && (
                                <span>
                                    Bạn có chắc chắn muốn xóa danh mục <b>{category.name}</b> không?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog
                        visible={deleteCategoriesDialog}
                        style={{ width: '450px' }}
                        header="Xác nhận"
                        modal
                        footer={deleteCategoriesDialogFooter}
                        onHide={hideDeleteCategoriesDialog}
                    >
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>Bạn có chắc chắn muốn xóa các danh mục đã chọn không?</span>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Category;