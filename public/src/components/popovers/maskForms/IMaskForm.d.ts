/**
 * represents a component that can be injected in a
 * terminal window with "submit"/"cancel" buttons
 */
interface IMaskForm {
    dom: HTMLElement,
    submit: () => Promise,
}