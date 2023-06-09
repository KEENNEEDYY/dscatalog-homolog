import { render, screen, waitFor } from "@testing-library/react"
import { Router } from "react-router-dom";
import history from "util/history";
import Catalog from "..";
import { server } from "./fixtures";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Catalog should render', () => {
    
    test('should render Catalog with title page', async () => {

        render(
            <Router history={history}>
                <Catalog />
            </Router>
        );

        expect(screen.getByText('Catálogo de produtos')).toBeInTheDocument();

        await waitFor( () => {
            expect(screen.getByText('PC Gamer Plus')).toBeInTheDocument();
        });      
    });
})