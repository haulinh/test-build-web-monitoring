import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { autobind } from 'core-decorators';
import ReactTelephoneInput from 'react-telephone-input/lib/withStyles';

const View = styled.div`
	.react-tel-input input[type='tel'] {
		height: initial;
		/* height: 32px; */
		box-shadow: none;
		padding-left: 54px;
		border: 1px solid #d4d4d4;
	}
	.react-tel-input .selected-flag {
		height: 100%;
		width: 46px;
	}
`;

@autobind
export default class InputPhoneNumber extends PureComponent {
	static propTypes = {
		onChange: PropTypes.func,
		value: PropTypes.any,
	};

	handleTelChange(telNumber, selectedCountry) {
		const dataSource = {
			phoneNumber: telNumber,
			...selectedCountry,
		};
		this.props.onChange(dataSource);
	}

	getRealValue() {
		return this.props.value ? this.props.value.phoneNumber : '';
	}

	render() {
		return (
			<View>
				<ReactTelephoneInput
					{...this.props}
					defaultCountry={'vn'}
					flagsImagePath='/images/flags.png'
					value={this.getRealValue()}
					onChange={this.handleTelChange}
					onBlur={() => {}}
				/>
			</View>
		);
	}
}
