import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { ProductService } from '../../demo/service/ProductService';

// CSS để tạo giao diện xem trước ảnh tốt hơn
const imagePreviewStyles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginTop: '10px',
    },
    imageWrapper: {
        position: 'relative',
        width: '100px',
        height: '100px',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '8px',
    },
    removeButton: {
        position: 'absolute',
        top: '-5px',
        right: '-5px',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
    },
};

const Product = () => {
    // BƯỚC 1: Thêm 'stock' vào emptyProduct
    let emptyProduct = {
        product_id: null,
        name: '',
        description: '',
        price: 0,
        stock: 0, // <-- ĐÃ THÊM
        category_id: null,
        image_url: '',
        title: '',
    };

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);

    const [existingImageUrls, setExistingImageUrls] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const toast = useRef(null);
    const dt = useRef(null);
    const fileInputRef = useRef(null);
    const productService = new ProductService();

    useEffect(() => {
        productService.getProducts()
            .then((data) => setProducts(data))
            .catch((error) => console.error('Lỗi khi lấy danh sách sản phẩm:', error));

        productService.getCategories()
            .then((data) => {
                if (Array.isArray(data)) {
                    setCategories(data);
                } else {
                    console.error('Dữ liệu danh mục không hợp lệ:', data);
                    setCategories([]);
                }
            })
            .catch((error) => console.error('Lỗi khi lấy danh sách danh mục:', error));
    }, []);

    const formatCurrency = (value) => {
        return (value || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
        setExistingImageUrls([]);
        setSelectedFiles([]);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const editProduct = (productData) => {
        const productToEdit = { ...productData };
        const imageUrls = productToEdit.image_url ? productToEdit.image_url.split(',').filter(url => url) : [];
        
        setProduct(productToEdit); 
        setExistingImageUrls(imageUrls);
        setSelectedFiles([]);
        setProductDialog(true);
        setSubmitted(false);
    };

    const saveProduct = async () => {
        setSubmitted(true);

        if (!product.name.trim() || !product.category_id) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng điền các trường bắt buộc.', life: 3000 });
            return;
        }

        try {
            const newImageNames = selectedFiles.map(file => file.name);
            const finalImageNames = [...existingImageUrls, ...newImageNames];
            const imageUrlString = finalImageNames.join(',');

            // `product.stock` đã được cập nhật trong state và sẽ tự động được gửi đi
            const productToSave = {
                ...product,
                image_url: imageUrlString,
            };
            
            if (selectedFiles.length > 0) {
                const imageUploadData = new FormData();
                selectedFiles.forEach(file => {
                    imageUploadData.append('images', file);
                });
                console.log("Chuẩn bị tải lên các file:", newImageNames);
            }

            if (productToSave.product_id) {
                await productService.updateProduct(productToSave.product_id, productToSave);
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã cập nhật sản phẩm', life: 3000 });
            } else {
                delete productToSave.product_id;
                await productService.createProduct(productToSave);
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã tạo sản phẩm', life: 3000 });
            }

            const updatedProducts = await productService.getProducts();
            setProducts(updatedProducts);
            setProductDialog(false);
            setProduct(emptyProduct);

        } catch (error) {
            console.error('Lỗi khi lưu sản phẩm:', error);
            const errorMessage = error.response?.data?.sqlMessage || error.message || 'Không thể lưu sản phẩm';
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: errorMessage, life: 5000 });
        }
    };

    const confirmDeleteProduct = (productData) => {
        setProduct(productData);
        setDeleteProductDialog(true);
    };

    const deleteProduct = async () => {
        try {
            await productService.deleteProduct(product.product_id);
            const _products = products.filter(val => val.product_id !== product.product_id);
            setProducts(_products);
            setDeleteProductDialog(false);
            setProduct(emptyProduct);
            toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa sản phẩm', life: 3000 });
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa sản phẩm', life: 3000 });
        }
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = async () => {
        try {
            const selectedIds = selectedProducts.map(p => p.product_id);
            const deletePromises = selectedIds.map(id => productService.deleteProduct(id));
            await Promise.all(deletePromises);

            let _products = products.filter(val => !selectedProducts.some(p => p.product_id === val.product_id));
            setProducts(_products);
            setDeleteProductsDialog(false);
            setSelectedProducts(null);
            toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa các sản phẩm đã chọn', life: 3000 });
        } catch (error) {
            console.error('Lỗi khi xóa nhiều sản phẩm:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa các sản phẩm', life: 3000 });
        }
    };

    const onFileChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
        }
    };

    const handleRemoveExistingImage = (indexToRemove) => {
        setExistingImageUrls(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleRemoveNewFile = (indexToRemove) => {
        const fileToRemove = selectedFiles[indexToRemove];
        if (fileToRemove.preview) {
            URL.revokeObjectURL(fileToRemove.preview);
        }
        setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };
    
    const newFilePreviews = selectedFiles.map(file => {
        if (!file.preview) {
            file.preview = URL.createObjectURL(file);
        }
        return file;
    });

    useEffect(() => {
        return () => {
            newFilePreviews.forEach(file => URL.revokeObjectURL(file.preview));
        };
    }, [newFilePreviews]);

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || e.value || '';
        setProduct(prev => ({ ...prev, [name]: val }));
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        setProduct(prev => ({ ...prev, [name]: val }));
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const leftToolbarTemplate = () => (
        <div className="my-2">
            <Button label="Thêm mới" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
            <Button label="Xóa" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
        </div>
    );

    const rightToolbarTemplate = () => (
        <Button label="Xuất CSV" icon="pi pi-upload" severity="help" onClick={exportCSV} />
    );

    const sttBodyTemplate = (rowData, { rowIndex }) => (rowIndex + 1);

    const imageBodyTemplate = (rowData) => {
        const imageString = rowData.image_url;
        const firstImage = imageString ? imageString.split(',')[0] : null;
        const imagePath = firstImage ? `/product/${firstImage}` : `https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png`;
        return <img src={imagePath} alt={rowData.name} className="shadow-2" width="100" />;
    };

    const priceBodyTemplate = (rowData) => formatCurrency(rowData.price);

    const categoryBodyTemplate = (rowData) => {
        const category = categories.find((cat) => cat.category_id === rowData.category_id);
        return category ? category.category_name : 'Không xác định';
    };

    const actionBodyTemplate = (rowData) => (
        <>
            <Button icon="pi pi-pencil" severity="success" rounded className="mr-2" onClick={() => editProduct(rowData)} />
            <Button icon="pi pi-trash" severity="warning" rounded onClick={() => confirmDeleteProduct(rowData)} />
        </>
    );

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Quản lý sản phẩm</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Tìm kiếm..." />
            </span>
        </div>
    );
    
    const productDialogFooter = (
        <>
            <Button label="Hủy" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Lưu" icon="pi pi-check" text onClick={saveProduct} />
        </>
    );

    const deleteProductDialogFooter = (
        <>
            <Button label="Không" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Có" icon="pi pi-check" text onClick={deleteProduct} />
        </>
    );

    const deleteProductsDialogFooter = (
        <>
            <Button label="Không" icon="pi pi-times" text onClick={hideDeleteProductsDialog} />
            <Button label="Có" icon="pi pi-check" text onClick={deleteSelectedProducts} />
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
                        value={products}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="product_id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Hiển thị {first} đến {last} của {totalRecords} sản phẩm"
                        globalFilter={globalFilter}
                        emptyMessage="Không tìm thấy sản phẩm."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                        <Column header="STT" body={sttBodyTemplate} headerStyle={{ minWidth: '3rem' }}></Column>
                        <Column field="name" header="Tên" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column header="Hình ảnh" body={imageBodyTemplate}></Column>
                        <Column field="price" header="Giá" body={priceBodyTemplate} sortable></Column>
                        
                        {/* BƯỚC 2: Thêm cột 'stock' vào DataTable */}
                        <Column field="stock" header="Số lượng" sortable headerStyle={{ minWidth: '8rem' }}></Column>

                        <Column field="category_id" header="Danh mục" body={categoryBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '600px' }} header="Chi tiết sản phẩm" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Tên sản phẩm</label>
                            <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                            {submitted && !product.name && <small className="p-invalid">Tên sản phẩm là bắt buộc.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Mô tả</label>
                            <InputTextarea id="description" value={product.description || ''} onChange={(e) => onInputChange(e, 'description')} rows={3} cols={20} />
                        </div>
                        <div className="field">
                            <label htmlFor="price">Giá</label>
                            <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="VND" locale="vi-VN" />
                        </div>

                        {/* BƯỚC 3: Thêm ô nhập liệu 'stock' vào Dialog */}
                        <div className="field">
                            <label htmlFor="stock">Số lượng tồn kho</label>
                            <InputNumber id="stock" value={product.stock} onValueChange={(e) => onInputNumberChange(e, 'stock')} integeronly />
                        </div>

                        <div className="field">
                            <label htmlFor="category_id">Danh mục</label>
                            <Dropdown
                                id="category_id"
                                value={product.category_id}
                                options={categories}
                                optionLabel="category_name"
                                optionValue="category_id" // <-- ĐÃ SỬA LẠI TỪ 'category_id' THÀNH 'id'
                                onChange={(e) => onInputChange(e, 'category_id')}
                                placeholder="Chọn danh mục"
                                className={classNames({ 'p-invalid': submitted && !product.category_id })}
                            />
                            {submitted && !product.category_id && <small className="p-invalid">Danh mục là bắt buộc.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="images">Hình ảnh sản phẩm</label>
                            <Button type="button" label="Chọn ảnh" icon="pi pi-upload" className="p-button-outlined p-button-secondary" onClick={() => fileInputRef.current?.click()} />
                            <input type="file" id="images" ref={fileInputRef} multiple accept="image/*" onChange={onFileChange} style={{ display: 'none' }} />
                            
                            <div style={imagePreviewStyles.container}>
                                {existingImageUrls.map((url, index) => (
                                    <div key={index} style={imagePreviewStyles.imageWrapper}>
                                        <img src={`/product/${url}`} alt={`Ảnh cũ ${index + 1}`} style={imagePreviewStyles.image} />
                                        <Button icon="pi pi-times" rounded text severity="danger" aria-label="Xóa" style={imagePreviewStyles.removeButton} onClick={() => handleRemoveExistingImage(index)} />
                                    </div>
                                ))}
                                {newFilePreviews.map((file, index) => (
                                    <div key={file.name + index} style={imagePreviewStyles.imageWrapper}>
                                        <img src={file.preview} alt={`Ảnh mới ${index + 1}`} style={imagePreviewStyles.image} />
                                        <Button icon="pi pi-times" rounded text severity="danger" aria-label="Xóa" style={imagePreviewStyles.removeButton} onClick={() => handleRemoveNewFile(index)} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="title">Tiêu đề</label>
                            <InputText id="title" value={product.title || ''} onChange={(e) => onInputChange(e, 'title')} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Xác nhận" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>Bạn có chắc muốn xóa sản phẩm <b>{product.name}</b>?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Xác nhận" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>Bạn có chắc chắn muốn xóa các sản phẩm đã chọn không?</span>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Product;
