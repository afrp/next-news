import AppPage from "@/app/page";
import {render, screen} from '@testing-library/react'
import { describe } from "node:test";

describe('App Page', () =>{
    it('should render', () =>{
        const page = render(<AppPage/>);
        expect(page).toMatchSnapshot();
    })
})