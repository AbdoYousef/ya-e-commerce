// import Container from "@mui/material/Container";
// import Grid from "@mui/material/Grid";
// import ProductCard from "../components/ProductCard";
// import { useEffect, useState } from "react";
// import { Product } from "../types/product";
// import { BASE_URL } from "../constants/baseUrl";
// import Box from "@mui/material/Box";

// export const Home = ()=>{
//     const [products, setProducts]= useState<Product[]>([]);
//     const [error, setError] = useState(false);

//     useEffect(()=>{
//         try{
//             const fetchData = async ()=>{
//                 const response = await fetch(`${BASE_URL}/product`);
//                 const data = await response.json();
//                 setProducts(data);
//             };
//             fetchData();
//         }
//         catch{
//             setError(true);
//         }

        
//     }, [])

//     if(error){
//         return(
//              <Box>Something went wrong, Please try again!</Box>
//     )}

//     return (
//         <Container sx={{ mt: 2 }}>
//             <Grid container spacing={2}>
//                 {products.map((p) => (
//                     <Grid size={{ md: 4,}}>
//                         <ProductCard 
//                             {...p} 
//                         />
//                     </Grid>
//                 ))}
//             </Grid>
//         </Container>
//     );
// };

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import { Product } from "../types/product";
import { BASE_URL } from "../constants/baseUrl";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

export const Home = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${BASE_URL}/product`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 2 }}>
                <Alert severity="error">
                    {error} - Please try again later
                </Alert>
            </Container>
        );
    }

    if (products.length === 0) {
        return (
            <Container sx={{ mt: 2 }}>
                <Alert severity="info">No products available</Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 2 }}>
        <Grid container spacing={2}>
            {products.map((p) => (
            <Grid size={{ md: 4,}}>
                <ProductCard 
                    {...p} 
                />
            </Grid>
            ))}
        </Grid>
        </Container>
    );
};