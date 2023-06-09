import { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { useForm, Controller } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import Select from   'react-select';
import { toast } from 'react-toastify';
import { Category } from 'types/Category';
import { Product } from 'types/products';
import { requestBackend } from 'util/requests';
import './styles.css'


type UrlParams = {
    productId: string;
  };

  const Form = () => {

    const { productId } = useParams<UrlParams>();
  
    const isEditing = productId !== 'create';
  
    const history = useHistory();

    const [selectCategories, setSelectCategories] = useState<Category[]>([]);

    const { register, handleSubmit, formState: {errors}, setValue, control } = useForm<Product>();

    useEffect( () => {
        requestBackend({url: '/categories'})
            .then( (response) => {
                setSelectCategories(response.data.content);
            })
    },[])

    useEffect(() => {
        if(isEditing){
            requestBackend({ url: `/products/${productId}` })
                .then((response) => {
                    const product = response.data as Product;
                    setValue('name', product.name);
                    setValue('price', product.price);
                    setValue('description', product.description);
                    setValue('imgUrl', product.imgUrl);
                    setValue('categories', product.categories);
                });
        }
    },[isEditing, productId, setValue]);

    const onSubmit = (product : Product) => {

        const data = {...product, price: String(product.price).replace(',','.')};

        const config: AxiosRequestConfig = {
            method: isEditing ? 'PUT' : 'POST',
            url: isEditing ? `/products/${productId}` : "/products",
            data,
            withCredentials: true,
        };
        requestBackend(config)
            .then((response) => {
                toast.info("Produto salvo com sucesso!");
                history.push("/admin/products");
            }).catch( () => {
                toast.error("Erro ao cadastrar o Produto");
            });   
    };
    
    const handleCancel = () => {
        history.push("/admin/products");
    }

    return(
        <div className="product-crud-container">
            <div className="base-card product-crud-form-card">
                <h1 className="product-crud-form-title">DADOS DO PRODUTO</h1>
                <form onSubmit={handleSubmit(onSubmit)} data-testid="form" >
                    <div className="row product-crud-inputs-container">
                        <div className="col-lg-6 product-crud-inputs-left-container">
                            <div className="margin-botton-30">
                                <input 
                                    data-testid="name"
                                    {...register('name', { required: 'Campo obrigatório'})}
                                    className={`form-control base-input ${ errors.name ? 'is-invalid': '' } `}
                                    type="text" placeholder= "Nome do produto" name="name"
                                />
                                <div className="invalid-feedback d-block"> {errors.name?.message} </div>
                            </div>
                            <div className="margin-botton-30">
                                <label htmlFor="categories" className="d-none">Categorias</label>
                                <Controller name='categories' rules={{required: true}} control={control} render={({field}) => (
                                   <Select {...field}
                                    options={selectCategories} isMulti classNamePrefix="product-crud-select" 
                                    getOptionLabel={(category: Category) => category.name} 
                                    getOptionValue={(category: Category) => String(category.id)}
                                    inputId="categories"
                                    /> 
                                )}/>
                                {errors.categories && (
                                    <div className="invalid-feedback d-block"> Campo obrigatório </div>
                                )}
                            </div>

                            <div className="margin-botton-30">
                                <Controller name="price" rules={{required: 'Campo obrigatório'}} control={control} render={ ({field}) => (
                                    <CurrencyInput 
                                        data-testid="price"
                                        placeholder='Preço'
                                        className={`form-control base-input ${ errors.name ? 'is-invalid' : '' }`}
                                        disableGroupSeparators={true}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    />
                                )}
                                />
                                <div className="invalid-feedback d-block"> {errors.price?.message} </div>
                            </div>

                            <div className="margin-botton-30">
                                <input 
                                    {...register('imgUrl', {required: 'Campo obrigatório',
                                        pattern: {
                                            value: /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm,
                                            message: 'Deve ser uma URL válida!',
                                            
                                        }  
                                    })}
                                    placeholder="URL"
                                    className={`form-control base-input ${errors.imgUrl ? 'is-invalid': ''}`}
                                    name="imgUrl"
                                    data-testid="imgUrl"
                                    type="text" />
                            </div>
                            <div className="invalid-feedback d-block">{errors.imgUrl?.message}</div>
                        </div>
                        <div className="col-lg-6">
                            <div>
                                <textarea 
                                    {...register('description', {required: 'Campo obrigatório'})}
                                    className={`form-control base-input h-auto ${errors.description ? 'is-invalid':''}`}
                                    name="description" rows={10} placeholder="Descrição" data-testid="description"/>
                            </div>
                            <div className="invalid-feedback d-block" >{errors.description?.message}</div>
                        </div>
                    </div>
                    <div className="product-crud-buttons-container">
                        <button onClick={handleCancel} className="btn btn-outline-danger product-crud-buttons">CANCELAR</button>
                        <button className="btn btn-primary product-crud-buttons text-white">SALVAR</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Form;