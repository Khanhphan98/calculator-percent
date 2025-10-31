import { mount } from '@vue/test-utils'
import App from '../App.vue';
import { describe, it, expect } from 'vitest'

describe('App.vue', () => {
    it('input check', async () => {
        const wrapper: any = mount(App)
        const input = wrapper.find('input')

        // helper để test input
        const testInput = async (value: string, expected: string, unit = 'px') => {
            await wrapper.vm.switchUnit(unit)
            await input.setValue(value)
            await input.trigger('focusout')
            expect(wrapper.vm.size).toBe(expected)
        }

        // chạy các case
        await testInput('12,3', '12.3')
        await testInput('a123', '123')
        await testInput('12a3', '123')
        await testInput('a123', '123')
        await testInput('12.3.4', '12.34')
        await testInput('-1', '0', '%')
    })

    it('input check 2', async () => {
        const wrapper: any = mount(App)
        const input = wrapper.find('input')
    })

    it('decrements when size = 0 and unit is %', async () => {
        const wrapper: any = mount(App)
        wrapper.vm.size = '1'
        await wrapper.find('#minus').trigger('click') // click nút −
        expect(wrapper.vm.size).toBe('0')

        // click continue and still value 0
        await wrapper.find('#minus').trigger('click')
        expect(wrapper.vm.size).toBe('0')
    })

    // check tăng khi size = 100 và unit là %
    it('increments when size = 100 and unit is %', async () => {
        const wrapper: any = mount(App)
        wrapper.vm.size = '99'
        await wrapper.find('#plus').trigger('click') // click nút −
        expect(wrapper.vm.size).toBe('100')

        // click continue and still value 0
        await wrapper.find('#plus').trigger('click')
        expect(wrapper.vm.size).toBe('100')
    })

    it('switch unit px to % if that size > 100 then change size = 100', async () => {
        const wrapper: any = mount(App)
        wrapper.vm.size = '110'
        await wrapper.vm.switchUnit('%');
        expect(wrapper.vm.size).toBe('100')
    })
})
